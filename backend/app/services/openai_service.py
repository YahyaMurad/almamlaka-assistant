from collections.abc import Generator

from openai import OpenAI

from app.core.config import get_settings

_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=get_settings().openai_api_key)
    return _client


def stream_chat_completion(messages: list[dict]) -> Generator[str, None, None]:
    client = get_client()
    stream = client.chat.completions.create(
        model=get_settings().openai_model,
        messages=messages,
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
