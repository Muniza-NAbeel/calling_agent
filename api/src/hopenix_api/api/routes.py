import logging
import httpx
from fastapi import APIRouter, Depends, Request
from fastapi import HTTPException

from hopenix_api.api.rate_limit import InMemoryRateLimiter
from hopenix_api.api_models import HealthResponse, PublicVoiceAgentConfigResponse, VoiceAgentTokenResponse, VoiceAgentUnavailableError
from hopenix_api.infrastructure.settings import Settings, get_settings

logger = logging.getLogger("hopenix_api.voice_agent")

router = APIRouter()


def rate_limit(request: Request) -> None:
    limiter: InMemoryRateLimiter = request.app.state.rate_limiter
    decision = limiter.check(limiter.client_key(request))
    if not decision.allowed:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(decision.retry_after_seconds)},
        )


@router.get("/health", response_model=HealthResponse, tags=["operations"], dependencies=[Depends(rate_limit)])
async def health() -> HealthResponse:
    return HealthResponse()


@router.get(
    "/v1/voice-agent/config",
    response_model=PublicVoiceAgentConfigResponse,
    tags=["voice-agent"],
    dependencies=[Depends(rate_limit)],
)
async def voice_agent_config(settings: Settings = Depends(get_settings)) -> PublicVoiceAgentConfigResponse:
    if not settings.elevenlabs_agent_id:
        raise VoiceAgentUnavailableError
    return PublicVoiceAgentConfigResponse(agent_id=settings.elevenlabs_agent_id)


@router.get(
    "/v1/voice-agent/token",
    response_model=VoiceAgentTokenResponse,
    tags=["voice-agent"],
    dependencies=[Depends(rate_limit)],
)
async def voice_agent_token(settings: Settings = Depends(get_settings)) -> VoiceAgentTokenResponse:
    if not settings.elevenlabs_api_key or not settings.elevenlabs_agent_id:
        raise VoiceAgentUnavailableError

    url = f"https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id={settings.elevenlabs_agent_id}"
    headers = {"xi-api-key": settings.elevenlabs_api_key}

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, headers=headers)

    if not response.is_success:
        logger.warning("ElevenLabs signed URL request failed: status=%s body=%s", response.status_code, response.text[:500])
        raise HTTPException(status_code=502, detail="Failed to obtain signed URL from ElevenLabs")

    data = response.json()
    signed_url = data.get("signed_url")
    if not signed_url:
        logger.warning("ElevenLabs signed URL response missing signed_url: %s", str(data)[:500])
        raise HTTPException(status_code=502, detail="Invalid response from ElevenLabs")

    return VoiceAgentTokenResponse(signed_url=signed_url)
