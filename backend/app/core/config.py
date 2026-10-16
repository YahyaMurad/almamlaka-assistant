from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    openai_api_key: str
    database_url: str = "postgresql+psycopg://mamlaka:mamlaka@localhost:5433/mamlaka"
    openai_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"

    chat_input_price_per_1m: float = 0.15
    chat_output_price_per_1m: float = 0.60
    embedding_price_per_1m: float = 0.02


@lru_cache
def get_settings() -> Settings:
    return Settings()
