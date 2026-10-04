"""App settings, read from environment variables (and an optional backend/.env)."""

from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/.env, wherever uvicorn is started from.
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    # Whose repos the site shows.
    github_username: str = "Rushee123"
    # Optional. Without it the GitHub API allows 60 requests/hour per IP.
    github_token: str | None = None
    # Phase 3. Unused until the db service is enabled.
    database_url: str | None = None

    # Compose passes unset vars as "" (e.g. ${GITHUB_TOKEN:-}); treat that as not set.
    @field_validator("github_token", "database_url", mode="before")
    @classmethod
    def empty_to_none(cls, value):
        return value or None


@lru_cache
def get_settings() -> Settings:
    return Settings()
