# Hopenix AI Calling Agent

Production architecture for a Hopenix website voice experience using Next.js, a Python API, ElevenLabs Conversational AI, and ElevenLabs' native Twilio integration.

## Boundaries

- `web/src/app`: presentation routes and server-rendered composition.
- `web/src/features/voice-agent`: the only client-side voice interaction surface.
- `web/src/domain`: provider-agnostic business contracts.
- `web/src/infrastructure`: server-only configuration and outbound adapters.
- `api/src/hopenix_api/domain`: Python domain contracts and transfer policy.
- `api/src/hopenix_api/integrations`: server-side ElevenLabs configuration. Native Twilio telephony is configured in ElevenLabs; credentials never cross this boundary into browser code.
- `api/src/hopenix_api/infrastructure`: settings, logging, and application wiring.

The browser owns only voice interaction state and requests the public ElevenLabs agent identifier from `/api/voice-agent/config`. The server-only configuration module prevents provider credentials from entering browser bundles. The ElevenLabs agent remains the source of truth for services, approved knowledge, customer guidance, pricing, policies, escalation, and transfer rules; none of those materials belong in `web/src`.

## Native Twilio production setup

Use a purchased Twilio phone number for inbound calling. Verified caller IDs are outbound-only and cannot be assigned to an ElevenLabs agent.

1. Purchase and provision a Twilio voice-capable number in E.164 format, for example `+15551234567`.
2. In ElevenLabs, open **Phone Numbers**, choose **Import number**, and enter the Twilio number plus either the Twilio Account SID/Auth Token or, preferably, a restricted Twilio API Key SID/API Key Secret.
3. Assign the imported inbound-capable number to `ELEVENLABS_AGENT_ID`. ElevenLabs applies the required Twilio phone-number configuration; do not add a custom Twilio webhook or call router.
4. In the agent's **Agent** configuration, add the official `transfer_to_number` system tool. Configure the approved human destination as an E.164 number and add rules for explicit human requests, human judgment, detailed quotations, sensitive or complex issues, unavailable information, complaints, and unsafe resolution. Use conference transfer when a warm message to the representative is required; blind transfer is also supported for native Twilio.
5. Store the values in the deployment secret store using `.env.example` as the shape. Never commit populated env files or place Twilio credentials in `web/.env.local`.

The application environment needs `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`, `TWILIO_PHONE_NUMBER`, and `TWILIO_TRANSFER_NUMBER` for server-side validation and agent configuration workflows. Twilio import credentials are entered in ElevenLabs and are not returned by any application route. The removed root `.env` must be recreated locally from `.env.example` only when needed, using secret-store values; never commit it.

## Telephony acceptance tests

These are real-provider tests and require a provisioned Twilio number, a configured ElevenLabs agent, and an approved human destination. Run them from a phone that can reach the Twilio number and observe the ElevenLabs Calls History dashboard.

1. **Inbound:** call `TWILIO_PHONE_NUMBER`; confirm the assigned agent answers, audio works in both directions, and the call appears in Calls History.
2. **Human transfer:** explicitly ask for a human, then repeat with a complex request, a detailed quotation request, a complaint, and an unavailable-information request. Confirm the configured `transfer_to_number` rule triggers and the representative receives the call.
3. **Failed transfer:** temporarily use a controlled invalid/unreachable approved destination in the ElevenLabs transfer rule, make a transfer request, confirm the call does not report success, and restore the approved E.164 destination immediately afterward.
4. **Termination:** end the call from the caller side, the agent side, and the browser voice session; confirm the call terminates and the history record closes.

Record the timestamp, originating number, agent ID, imported Twilio number, transfer rule, result, and Calls History conversation ID for each test. Do not record credentials or expose the human destination in client logs.

## Development

Web:

```text
cd web
npm run build
```

For the browser voice experience, configure `web/.env.local` from `web/.env.example` with only the public ElevenLabs agent ID. The web client requests that identifier from `/api/voice-agent/config`; ElevenLabs API keys, Twilio credentials, the Twilio number, and the transfer destination stay outside browser code.

API validation without installing dependencies:

```text
python -m compileall api/src
```

Copy `.env.example` to the deployment-specific secret store. Do not commit populated environment files.
