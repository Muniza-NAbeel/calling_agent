export type VoiceSessionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "ending"
  | "disconnected"
  | "error";

export type VoiceAgentActivity = "idle" | "listening" | "speaking" | "interrupted";

export type VoicePermissionStatus = "unknown" | "requesting" | "granted" | "denied";

export type AgentEventStatus = "idle" | "requested" | "completed" | "failed";

export type TransferStatus = "idle" | "in_progress" | "completed" | "failed";

export type VoiceAgentErrorCode =
  | "unsupported_browser"
  | "microphone_denied"
  | "microphone_unavailable"
  | "backend_failure"
  | "api_timeout"
  | "connection_failure"
  | "network_interruption"
  | "provider_unavailable"
  | "duplicate_session"
  | "session_timeout"
  | "unexpected_disconnect"
  | "transfer_failure"
  | "unknown";

export interface VoiceSessionRequest {
  readonly locale?: string;
}

export interface PublicVoiceAgentConfig {
  readonly agentId: string;
}

export interface VoiceAgentTokenResponse {
  readonly signedUrl: string;
}

export interface VoiceSession {
  readonly sessionId: string;
  readonly status: VoiceSessionStatus;
  readonly clientToken: string;
}

export interface VoiceSessionError {
  readonly code: string;
  readonly message: string;
}

export interface VoiceAgentGateway {
  createSession(request: VoiceSessionRequest): Promise<VoiceSession>;
  endSession(sessionId: string): Promise<void>;
}

export interface VoiceAgentClientState {
  readonly status: VoiceSessionStatus;
  readonly activity: VoiceAgentActivity;
  readonly permission: VoicePermissionStatus;
  readonly muted: boolean;
  readonly transferStatus: TransferStatus;
  readonly transferError?: string;
  readonly durationSeconds: number;
  readonly audioLevel: number;
  readonly agentEventStatus: AgentEventStatus;
  readonly errorCode?: VoiceAgentErrorCode;
  readonly errorMessage?: string;
}
