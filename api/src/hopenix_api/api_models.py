from pydantic import BaseModel, ConfigDict, Field


class PublicVoiceAgentConfigResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    agent_id: str = Field(min_length=1)


class VoiceAgentTokenResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    signed_url: str = Field(min_length=1)


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: str = "ok"


class ErrorResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    error: str
    message: str
    request_id: str


class VoiceAgentUnavailableError(Exception):
    """Raised when required server-side voice-agent configuration is unavailable."""
