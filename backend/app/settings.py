"""App settings, read from environment variables (and an optional backend/.env)."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Whose repos the site shows.
    github_username: str = "Rushee123"
    # Optional. Without it the GitHub API allows 60 requests/hour per IP.
    github_token: str | None = None
    # Phase 3. Unused until the db service is enabled.
    database_url: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
