from collections.abc import Generator

from openai import OpenAI

from app.core.config import get_settings

_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=get_settings().openai_api_key)
    return _client


def stream_chat_completion(
    messages: list[dict], usage_holder: dict | None = None
) -> Generator[str, None, None]:
    client = get_client()
    stream = client.chat.completions.create(
        model=get_settings().openai_model,
        messages=messages,
        stream=True,
        stream_options={"include_usage": True},
    )
    for chunk in stream:
        if chunk.usage is not None and usage_holder is not None:
            usage_holder["prompt_tokens"] = chunk.usage.prompt_tokens
            usage_holder["completion_tokens"] = chunk.usage.completion_tokens
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


def embed_texts(
    texts: list[str], batch_size: int = 100
) -> tuple[list[list[float]], int]:
    client = get_client()
    model = get_settings().openai_embedding_model

    embeddings: list[list[float]] = []
    total_tokens = 0
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = client.embeddings.create(model=model, input=batch)
        embeddings.extend(item.embedding for item in response.data)
        total_tokens += response.usage.total_tokens
    return embeddings, total_tokens


def translate_to_english(text: str) -> tuple[str, int, int]:
    client = get_client()
    response = client.chat.completions.create(
        model=get_settings().openai_model,
        messages=[
            {
                "role": "system",
                "content": "Translate the user's message to English. Reply with only the "
                "translation, no commentary.",
            },
            {"role": "user", "content": text},
        ],
    )
    translation = response.choices[0].message.content or text
    return translation, response.usage.prompt_tokens, response.usage.completion_tokens
