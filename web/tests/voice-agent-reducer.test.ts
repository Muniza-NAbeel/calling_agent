import { describe, expect, it } from "vitest";

import { initialVoiceAgentState, voiceAgentReducer } from "@/features/voice-agent/hooks/use-voice-agent-session";

describe("voice agent state machine", () => {
  it("moves through connection and speaking states", () => {
    const connecting = voiceAgentReducer(initialVoiceAgentState, { type: "connect" });
    const connected = voiceAgentReducer(connecting, { type: "connected" });
    const speaking = voiceAgentReducer(connected, { type: "activity", activity: "speaking" });

    expect(connecting.status).toBe("connecting");
    expect(connected.activity).toBe("listening");
    expect(speaking.activity).toBe("speaking");
  });

  it("never represents a failed transfer as completed", () => {
    const requested = voiceAgentReducer(initialVoiceAgentState, { type: "transfer-requested" });
    const failed = voiceAgentReducer(requested, { type: "transfer-failed" });

    expect(requested.transferStatus).toBe("in_progress");
    expect(failed.transferStatus).toBe("failed");
    expect(failed.errorCode).toBe("transfer_failure");
  });

  it("provides recovery state for timeout and permission denial", () => {
    const denied = voiceAgentReducer(initialVoiceAgentState, { type: "permission-denied", code: "microphone_denied" });
    const timeout = voiceAgentReducer(initialVoiceAgentState, { type: "error", code: "session_timeout" });

    expect(denied.errorMessage).toMatch(/microphone/i);
    expect(timeout.errorMessage).toMatch(/time limit/i);
  });
});