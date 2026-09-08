from hopenix_api.domain.contracts import TransferRequest


class TwilioTelephonyClient:
    """Credential boundary for native Twilio configuration owned by ElevenLabs."""

    def __init__(self, account_sid: str, auth_token: str, transfer_number: str) -> None:
        self._account_sid = account_sid
        self._auth_token = auth_token
        self._transfer_number = transfer_number

    async def transfer_call(self, request: TransferRequest) -> None:
        raise NotImplementedError(
            "Connect this adapter to the approved ElevenLabs transfer_to_number flow before enabling it."
        )
