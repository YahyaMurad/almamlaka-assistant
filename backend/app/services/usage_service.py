import uuid

from sqlalchemy.orm import Session

from app.models.usage import UsageEvent, UsageEventType
from app.services.pricing import estimate_chat_cost, estimate_embedding_cost


def record_chat_usage(
    db: Session,
    model: str,
    prompt_tokens: int,
    completion_tokens: int,
    event_type: UsageEventType = UsageEventType.CHAT,
    conversation_id: uuid.UUID | None = None,
) -> None:
    db.add(
        UsageEvent(
            event_type=event_type,
            model=model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            cost_usd=estimate_chat_cost(prompt_tokens, completion_tokens),
            conversation_id=conversation_id,
        )
    )
    db.commit()


def record_embedding_usage(
    db: Session,
    model: str,
    total_tokens: int,
    event_type: UsageEventType = UsageEventType.EMBEDDING,
    conversation_id: uuid.UUID | None = None,
) -> None:
    db.add(
        UsageEvent(
            event_type=event_type,
            model=model,
            prompt_tokens=total_tokens,
            completion_tokens=0,
            total_tokens=total_tokens,
            cost_usd=estimate_embedding_cost(total_tokens),
            conversation_id=conversation_id,
        )
    )
    db.commit()
