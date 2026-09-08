from typing import Literal, TypedDict

from hopenix_api.domain.contracts import VoiceSession, VoiceSessionRequest

TransferType = Literal["conference", "blind"]


class TransferDestination(TypedDict):
    type: Literal["phone"]
    phone_number: str


class TransferRule(TypedDict):
    transfer_destination: TransferDestination
    condition: str
    transfer_type: TransferType


class TransferToolParams(TypedDict):
    system_tool_type: Literal["transfer_to_number"]
    transfers: list[TransferRule]


class TransferToolConfig(TypedDict):
    type: Literal["system"]
    name: Literal["transfer_to_number"]
    description: str
    params: TransferToolParams


ESCALATION_CONDITIONS = (
    "Transfer when the caller explicitly asks for a human representative.",
    "Transfer when human judgment is required to resolve the request.",
    "Transfer when the caller requires a detailed quotation.",
    "Transfer when the issue is sensitive or complex.",
    "Transfer when the required information is unavailable to the agent.",
    "Transfer when the caller raises a complaint requiring human handling.",
    "Transfer when the agent cannot safely resolve the request.",
)


class ElevenLabsConversationClient:
    """Server-side boundary for ElevenLabs session creation."""

    def __init__(self, api_key: str, agent_id: str) -> None:
        self._api_key = api_key
        self._agent_id = agent_id

    def transfer_tool_config(self, transfer_number: str) -> TransferToolConfig:
        """Build the server-side system-tool fragment applied to the ElevenLabs agent."""
        transfers: list[TransferRule] = []
        for condition in ESCALATION_CONDITIONS:
            transfers.append(
                {
                    "transfer_destination": {"type": "phone", "phone_number": transfer_number},
                    "condition": condition,
                    "transfer_type": "conference",
                }
            )
        return {
            "type": "system",
            "name": "transfer_to_number",
            "description": "Transfer callers to the configured human representative when an escalation condition applies.",
            "params": {
                "system_tool_type": "transfer_to_number",
                "transfers": transfers,
            },
        }

    async def create_session(self, request: VoiceSessionRequest) -> VoiceSession:
        raise NotImplementedError(
            "Connect this adapter to the current ElevenLabs Conversational AI API before enabling it."
        )
