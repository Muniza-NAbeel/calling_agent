from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class VoiceSessionRequest:
    locale: str | None = None


@dataclass(frozen=True)
class VoiceSession:
    session_id: str
    client_token: str


@dataclass(frozen=True)
class TransferRequest:
    session_id: str
    destination: str


class ConversationProvider(Protocol):
    async def create_session(self, request: VoiceSessionRequest) -> VoiceSession: ...
