import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import SessionLocal, get_db
from app.models.messages import Conversation, Message, MessageRole
from app.schemas.conversation import (
    ConversationCreate,
    ConversationDetailOut,
    ConversationOut,
    MessageCreate,
)
from app.services.openai_service import stream_chat_completion
from app.services.rag_service import build_rag_messages
from app.services.usage_service import record_chat_usage

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("", response_model=ConversationOut)
def create_conversation(
    payload: ConversationCreate, db: Session = Depends(get_db)
) -> Conversation:
    conversation = Conversation(title=payload.title, client_id=payload.client_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.get("", response_model=list[ConversationOut])
def list_conversations(
    client_id: str | None = None, db: Session = Depends(get_db)
) -> list[Conversation]:
    if not client_id:
        return []
    return list(
        db.execute(
            select(Conversation)
            .where(Conversation.client_id == client_id)
            .order_by(Conversation.created_at.desc())
        ).scalars()
    )


@router.get("/{conversation_id}", response_model=ConversationDetailOut)
def get_conversation(
    conversation_id: uuid.UUID, db: Session = Depends(get_db)
) -> Conversation:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.post("/{conversation_id}/messages")
def send_message(
    conversation_id: uuid.UUID,
    payload: MessageCreate,
    db: Session = Depends(get_db),
) -> StreamingResponse:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    user_message = Message(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content=payload.content,
    )
    db.add(user_message)
    db.commit()
    db.refresh(conversation)

    history = [
        {"role": m.role.value, "content": m.content} for m in conversation.messages
    ]
    completion_messages, sources = build_rag_messages(
        db, payload.content, history, conversation_id=conversation_id
    )

    def event_stream():
        chunks = []
        usage_holder: dict = {}
        for delta in stream_chat_completion(completion_messages, usage_holder):
            chunks.append(delta)
            yield f"data: {json.dumps({'delta': delta})}\n\n"

        with SessionLocal() as stream_db:
            assistant_message = Message(
                conversation_id=conversation_id,
                role=MessageRole.ASSISTANT,
                content="".join(chunks),
                sources=sources or None,
            )
            stream_db.add(assistant_message)
            stream_db.commit()

            if usage_holder:
                record_chat_usage(
                    stream_db,
                    model=get_settings().openai_model,
                    prompt_tokens=usage_holder.get("prompt_tokens", 0),
                    completion_tokens=usage_holder.get("completion_tokens", 0),
                    conversation_id=conversation_id,
                )

        yield f"data: {json.dumps({'done': True, 'sources': sources})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
