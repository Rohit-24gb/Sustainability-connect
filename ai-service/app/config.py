from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ai_service_name: str = "Sustainability Connect AI Service"
    ai_service_port: int = 8000
    mongodb_uri: str = "mongodb://localhost:27017/sustainability"
    mongodb_db: str = "sustainability"
    recommendation_limit: int = 8
    search_limit: int = 20

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
