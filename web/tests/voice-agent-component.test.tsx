import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { VoiceAgent } from "@/features/voice-agent/components/voice-agent";

const start = vi.fn();
const toggleMute = vi.fn();

vi.mock("@/features/voice-agent/hooks/use-voice-agent-session", () => ({
  useVoiceAgentSession: () => ({
    state: {
      status: "error",
      activity: "idle",
      permission: "denied",
      muted: false,
      transferStatus: "idle",
      durationSeconds: 0,
      audioLevel: 0,
      agentEventStatus: "idle",
      errorMessage: "Microphone access was denied. Allow it in your browser settings and try again.",
    },
    start,
    end: vi.fn(),
    retry: vi.fn(),
    toggleMute,
  }),
}));

describe("VoiceAgent", () => {
  it("renders a safe recovery message and retry control", () => {
    render(<VoiceAgent />);

    expect(screen.getByRole("alert")).toHaveTextContent(/microphone access was denied/i);
    expect(screen.getByRole("button", { name: /retry connection/i })).toBeInTheDocument();
  });

  it("keeps interaction controls accessible", () => {
    render(<VoiceAgent />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(start).toHaveBeenCalled();
  });
});