import { beforeEach, describe, expect, it, vi } from "vitest";

import { hasAnalyticsConsent, setAnalyticsProvider, trackVoiceAnalytics } from "@/features/voice-agent/services/analytics";

describe("voice analytics", () => {
  const track = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    track.mockReset();
    setAnalyticsProvider({ track });
  });

  it("does not emit events without explicit consent", () => {
    trackVoiceAnalytics("call_started");
    expect(hasAnalyticsConsent()).toBe(false);
    expect(track).not.toHaveBeenCalled();
  });
});