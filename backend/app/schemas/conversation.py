import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.messages import MessageRole


class SourceOut(BaseModel):
    title: str
    section: str
    document_id: str | None = None
    page: int | None = None


class MessageOut(BaseModel):
    id: uuid.UUID
    role: MessageRole
    content: str
    sources: list[SourceOut] | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationOut(BaseModel):
    id: uuid.UUID
    title: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationDetailOut(ConversationOut):
    messages: list[MessageOut]


class ConversationCreate(BaseModel):
    title: str | None = None
    client_id: str | None = None


class MessageCreate(BaseModel):
    content: str
