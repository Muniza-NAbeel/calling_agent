import { NextResponse } from "next/server";

import type { PublicVoiceAgentConfig } from "@/domain/voice-agent";
import { getServerConfig } from "@/infrastructure/config";

export async function GET() {
  const requestId = crypto.randomUUID();
  try {
    const { apiBaseUrl } = getServerConfig();
    const response = await fetch(`${apiBaseUrl}/v1/voice-agent/config`, {
      cache: "no-store",
      headers: { Accept: "application/json", "X-Request-ID": requestId },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`Voice-agent API returned ${response.status}`);
    const payload = (await response.json()) as { agent_id?: string };
    if (!payload.agent_id) throw new Error("Voice-agent API returned invalid configuration.");
    const config: PublicVoiceAgentConfig = { agentId: payload.agent_id };
    return NextResponse.json(config, {
      headers: { "Cache-Control": "no-store", "X-Request-ID": requestId },
    });
  } catch {
    return NextResponse.json(
      { error: "Voice agent is unavailable.", requestId },
      { status: 503, headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } },
    );
  }
}