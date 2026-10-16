from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.documents import Document
from app.models.messages import Conversation, Message, MessageRole
from app.models.usage import UsageEvent
from app.schemas.stats import DailyActivity, StatsOut, UsageByType

router = APIRouter(prefix="/stats", tags=["stats"])

ACTIVITY_WINDOW_DAYS = 14


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)) -> StatsOut:
    conversation_count = db.scalar(select(func.count(Conversation.id))) or 0
    message_count = db.scalar(select(func.count(Message.id))) or 0
    document_count = db.scalar(select(func.count(Document.id))) or 0

    total_tokens = (
        db.scalar(select(func.coalesce(func.sum(UsageEvent.total_tokens), 0))) or 0
    )
    estimated_cost = (
        db.scalar(select(func.coalesce(func.sum(UsageEvent.cost_usd), 0))) or 0
    )

    assistant_count = (
        db.scalar(
            select(func.count(Message.id)).where(Message.role == MessageRole.ASSISTANT)
        )
        or 0
    )
    cited_count = (
        db.scalar(
            select(func.count(Message.id)).where(
                Message.role == MessageRole.ASSISTANT, Message.sources.isnot(None)
            )
        )
        or 0
    )

    usage_rows = db.execute(
        select(
            UsageEvent.event_type,
            func.sum(UsageEvent.total_tokens),
            func.sum(UsageEvent.cost_usd),
        ).group_by(UsageEvent.event_type)
    ).all()

    since = datetime.now(timezone.utc) - timedelta(days=ACTIVITY_WINDOW_DAYS)
    daily_rows = db.execute(
        select(func.date(Message.created_at).label("day"), func.count(Message.id))
        .where(Message.created_at >= since)
        .group_by("day")
        .order_by("day")
    ).all()

    return StatsOut(
        conversation_count=conversation_count,
        message_count=message_count,
        total_tokens=int(total_tokens),
        estimated_cost_usd=float(estimated_cost),
        document_count=document_count,
        avg_messages_per_conversation=(
            message_count / conversation_count if conversation_count else 0.0
        ),
        rag_hit_rate=(cited_count / assistant_count if assistant_count else 0.0),
        usage_by_type=[
            UsageByType(
                event_type=event_type.value,
                total_tokens=int(tokens or 0),
                cost_usd=float(cost or 0),
            )
            for event_type, tokens, cost in usage_rows
        ],
        daily_activity=[
            DailyActivity(date=str(day), message_count=int(count))
            for day, count in daily_rows
        ],
    )
