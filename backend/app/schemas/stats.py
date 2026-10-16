from pydantic import BaseModel


class UsageByType(BaseModel):
    event_type: str
    total_tokens: int
    cost_usd: float


class DailyActivity(BaseModel):
    date: str
    message_count: int


class StatsOut(BaseModel):
    conversation_count: int
    message_count: int
    total_tokens: int
    estimated_cost_usd: float
    document_count: int
    avg_messages_per_conversation: float
    rag_hit_rate: float
    usage_by_type: list[UsageByType]
    daily_activity: list[DailyActivity]
