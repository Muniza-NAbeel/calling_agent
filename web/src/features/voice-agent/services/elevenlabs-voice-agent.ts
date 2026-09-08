"use client";

import { Conversation, type VoiceConversation } from "@elevenlabs/client";

import type { VoiceAgentErrorCode, VoiceAgentTokenResponse } from "@/domain/voice-agent";

export class VoiceAgentServiceError extends Error {
  constructor(readonly code: VoiceAgentErrorCode) {
    super(code);
    this.name = "VoiceAgentServiceError";
  }
}

export interface ElevenLabsVoiceAgentCallbacks {
  readonly onConnect: () => void;
  readonly onDisconnect: (code: VoiceAgentErrorCode) => void;
  readonly onError: (code: VoiceAgentErrorCode) => void;
  readonly onModeChange: (mode: "listening" | "speaking") => void;
  readonly onInterruption: () => void;
  readonly onTransferRequested: () => void;
  readonly onTransferResponse: (failed: boolean) => void;
}

function isSupportedBrowser(): boolean {
  return typeof window !== "undefined"
    && window.isSecureContext
    && typeof navigator.mediaDevices?.getUserMedia === "function";
}

function classifyError(error: unknown, fallback: VoiceAgentErrorCode): VoiceAgentServiceError {
  if (error instanceof VoiceAgentServiceError) return error;
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return new VoiceAgentServiceError("microphone_denied");
  }

  if (error instanceof DOMException && error.name === "NotFoundError") {
    return new VoiceAgentServiceError("microphone_unavailable");
  }

  if (error instanceof DOMException && error.name === "AbortError") return new VoiceAgentServiceError("api_timeout");
  if (error instanceof TypeError) return new VoiceAgentServiceError("network_interruption");
  return new VoiceAgentServiceError(fallback);
}

async function fetchToken(): Promise<string> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch("/api/voice-agent/token", { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new VoiceAgentServiceError("backend_failure");
    const payload = (await response.json()) as Partial<VoiceAgentTokenResponse>;
    if (!payload.signedUrl) throw new VoiceAgentServiceError("backend_failure");
    return payload.signedUrl;
  } catch (error) {
    throw classifyError(error, "backend_failure");
  } finally {
    window.clearTimeout(timeout);
  }
}

export class ElevenLabsVoiceAgentService {
  private conversation: VoiceConversation | null = null;

  get isActive(): boolean {
    return this.conversation !== null;
  }

  async start(callbacks: ElevenLabsVoiceAgentCallbacks): Promise<void> {
    if (this.conversation) throw new VoiceAgentServiceError("duplicate_session");
    if (!isSupportedBrowser()) {
      throw new VoiceAgentServiceError("unsupported_browser");
    }

    let microphone: MediaStream;
    try {
      microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      throw classifyError(error, "microphone_unavailable");
    }
    microphone.getTracks().forEach((track) => track.stop());

    const signedUrl = await fetchToken();

    try {
      this.conversation = await Conversation.startSession({
        signedUrl,
        connectionType: "websocket",
        textOnly: false,
        onConnect: callbacks.onConnect,
        onDisconnect: (details) => {
          this.conversation = null;
          callbacks.onDisconnect(details.reason === "error" ? "unexpected_disconnect" : "network_interruption");
        },
        onError: () => callbacks.onError("provider_unavailable"),
        onModeChange: ({ mode }) => callbacks.onModeChange(mode),
        onInterruption: callbacks.onInterruption,
        onAgentToolRequest: (request) => {
          if (request.tool_name === "transfer_to_number") callbacks.onTransferRequested();
        },
        onAgentToolResponse: (response) => {
          if (response.tool_name !== "transfer_to_number") return;
          callbacks.onTransferResponse(response.is_error || !response.is_called);
        },
      });
    } catch (error) {
      this.conversation = null;
      throw classifyError(error, "connection_failure");
    }
  }

  async end(): Promise<void> {
    const conversation = this.conversation;
    if (!conversation) return;

    this.conversation = null;
    await conversation.endSession();
  }

  setMuted(muted: boolean): void {
    this.conversation?.setMicMuted(muted);
  }

  getInputVolume(): number {
    return this.conversation?.getInputVolume() ?? 0;
  }

  getOutputVolume(): number {
    return this.conversation?.getOutputVolume() ?? 0;
  }
}

export function readableVoiceAgentError(error: unknown): VoiceAgentErrorCode {
  return error instanceof VoiceAgentServiceError ? error.code : "unknown";
}