from functools import lru_cache
import re

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    elevenlabs_api_key: str = Field(default=...)
    elevenlabs_agent_id: str = Field(default=...)
    twilio_account_sid: str = Field(default=...)
    twilio_auth_token: str = Field(default=...)
    twilio_transfer_number: str = Field(default=...)
    rate_limit_requests: int = 100
    rate_limit_window_seconds: int = 60
    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @field_validator("twilio_transfer_number")
    @classmethod
    def validate_e164_number(cls, value: str) -> str:
        if not re.fullmatch(r"\+[1-9]\d{7,14}", value):
            raise ValueError("Twilio phone numbers must use E.164 format")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()