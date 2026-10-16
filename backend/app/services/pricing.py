from app.core.config import get_settings


def estimate_chat_cost(prompt_tokens: int, completion_tokens: int) -> float:
    settings = get_settings()
    return (
        prompt_tokens / 1_000_000 * settings.chat_input_price_per_1m
        + completion_tokens / 1_000_000 * settings.chat_output_price_per_1m
    )


def estimate_embedding_cost(total_tokens: int) -> float:
    settings = get_settings()
    return total_tokens / 1_000_000 * settings.embedding_price_per_1m
