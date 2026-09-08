"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import type {
  VoiceAgentActivity,
  VoiceAgentClientState,
  VoiceAgentErrorCode,
  VoicePermissionStatus,
  VoiceSessionStatus,
} from "@/domain/voice-agent";

import { trackVoiceAnalytics } from "../services/analytics";
import { ElevenLabsVoiceAgentService, readableVoiceAgentError } from "../services/elevenlabs-voice-agent";

export type VoiceAgentAction =
  | { type: "connect" }
  | { type: "permission-requesting" }
  | { type: "permission-granted" }
  | { type: "permission-denied"; code: VoiceAgentErrorCode }
  | { type: "connected" }
  | { type: "activity"; activity: VoiceAgentActivity }
  | { type: "interrupted" }
  | { type: "muted"; muted: boolean }
  | { type: "ending" }
  | { type: "disconnected" }
  | { type: "tick" }
  | { type: "audio-level"; level: number }
  | { type: "transfer-requested" }
  | { type: "transfer-completed" }
  | { type: "transfer-failed" }
  | { type: "error"; code: VoiceAgentErrorCode }
  | { type: "reset" };

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const errorMessages: Record<VoiceAgentErrorCode, string> = {
  unsupported_browser: "Voice conversations need a secure, microphone-enabled browser.",
  microphone_denied: "Microphone access was denied. Allow it in your browser settings and try again.",
  microphone_unavailable: "No usable microphone was found. Check your device and try again.",
  backend_failure: "The voice service is temporarily unavailable. Please try again shortly.",
  api_timeout: "The voice service took too long to respond. Please try again.",
  connection_failure: "We could not connect the conversation. Please check your connection and try again.",
  network_interruption: "The connection was interrupted. Check your network and try again.",
  provider_unavailable: "The voice service is unavailable right now. Please try again shortly.",
  duplicate_session: "A conversation is already being started or is in progress.",
  session_timeout: "This conversation reached its time limit. You can start a new one.",
  unexpected_disconnect: "The conversation ended unexpectedly. You can try again.",
  transfer_failure: "The human transfer could not be completed. Please try again or end the call.",
  unknown: "Something went wrong with the conversation. Please try again.",
};

export const initialVoiceAgentState: VoiceAgentClientState = {
  status: "idle",
  activity: "idle",
  permission: "unknown",
  muted: false,
  transferStatus: "idle",
  durationSeconds: 0,
  audioLevel: 0,
  agentEventStatus: "idle",
};

export function voiceAgentReducer(state: VoiceAgentClientState, action: VoiceAgentAction): VoiceAgentClientState {
  switch (action.type) {
    case "connect":
      return { ...initialVoiceAgentState, status: "connecting", permission: state.permission };
    case "permission-requesting":
      return { ...state, permission: "requesting" };
    case "permission-granted":
      return { ...state, permission: "granted" };
    case "permission-denied":
      return { ...state, status: "error", permission: "denied", errorCode: action.code, errorMessage: errorMessages[action.code] };
    case "connected":
      return { ...state, status: "connected", activity: "listening", errorCode: undefined, errorMessage: undefined };
    case "activity":
      return { ...state, activity: action.activity };
    case "interrupted":
      return { ...state, activity: "interrupted" };
    case "muted":
      return { ...state, muted: action.muted };
    case "ending":
      return { ...state, status: "ending", activity: "idle", audioLevel: 0 };
    case "disconnected":
      return { ...state, status: "disconnected", activity: "idle", audioLevel: 0, errorCode: undefined, errorMessage: undefined };
    case "tick":
      return { ...state, durationSeconds: state.durationSeconds + 1 };
    case "audio-level":
      return { ...state, audioLevel: action.level };
    case "transfer-requested":
      return { ...state, transferStatus: "in_progress", transferError: undefined };
    case "transfer-completed":
      return { ...state, transferStatus: "completed", transferError: undefined };
    case "transfer-failed":
      return { ...state, transferStatus: "failed", errorCode: "transfer_failure", transferError: errorMessages.transfer_failure };
    case "error":
      return { ...state, status: "error", activity: "idle", audioLevel: 0, errorCode: action.code, errorMessage: errorMessages[action.code] };
    case "reset":
      return { ...initialVoiceAgentState, permission: state.permission };
  }
}

export function useVoiceAgentSession() {
  const [state, dispatch] = useReducer(voiceAgentReducer, initialVoiceAgentState);
  const [service] = useState(() => new ElevenLabsVoiceAgentService());
  const operationRef = useRef(false);
  const endingRef = useRef(false);

  const start = useCallback(async () => {
    if (operationRef.current || service.isActive) {
      dispatch({ type: "error", code: "duplicate_session" });
      return;
    }

    operationRef.current = true;
    endingRef.current = false;
    dispatch({ type: "connect" });
    dispatch({ type: "permission-requesting" });
    trackVoiceAnalytics("call_started");

    try {
      await service.start({
        onConnect: () => {
          dispatch({ type: "permission-granted" });
          dispatch({ type: "connected" });
          trackVoiceAnalytics("call_connected");
        },
        onDisconnect: (code) => {
          operationRef.current = false;
          if (endingRef.current) return;
          dispatch({ type: "error", code });
          trackVoiceAnalytics("call_failed");
        },
        onError: (code) => {
          operationRef.current = false;
          endingRef.current = true;
          dispatch({ type: "error", code });
          trackVoiceAnalytics("call_failed");
        },
        onModeChange: (mode) => dispatch({ type: "activity", activity: mode }),
        onInterruption: () => dispatch({ type: "interrupted" }),
        onTransferRequested: () => {
          dispatch({ type: "transfer-requested" });
          trackVoiceAnalytics("transfer_requested");
        },
        onTransferResponse: (failed) => {
          dispatch({ type: failed ? "transfer-failed" : "transfer-completed" });
          trackVoiceAnalytics(failed ? "transfer_failed" : "transfer_completed");
        },
      });
    } catch (error) {
      operationRef.current = false;
      const code = readableVoiceAgentError(error);
      if (code === "microphone_denied") dispatch({ type: "permission-denied", code });
      else dispatch({ type: "error", code });
      trackVoiceAnalytics("call_failed");
    }
  }, [service]);

  const end = useCallback(async (reason: "user" | "timeout" = "user") => {
    if (endingRef.current || !service.isActive) return;
    endingRef.current = true;
    dispatch({ type: "ending" });
    try {
      await service.end();
      operationRef.current = false;
      if (reason === "timeout") {
        dispatch({ type: "error", code: "session_timeout" });
        trackVoiceAnalytics("call_failed");
      } else {
        dispatch({ type: "disconnected" });
        trackVoiceAnalytics("call_ended");
      }
    } catch (error) {
      operationRef.current = false;
      dispatch({ type: "error", code: readableVoiceAgentError(error) });
      trackVoiceAnalytics("call_failed");
    }
  }, [service]);

  const toggleMute = useCallback(() => {
    if (!service.isActive) return;
    service.setMuted(!state.muted);
    dispatch({ type: "muted", muted: !state.muted });
  }, [service, state.muted]);

  const retry = useCallback(() => {
    if (operationRef.current || state.status === "connecting" || state.status === "ending" || service.isActive) return;
    dispatch({ type: "reset" });
    void start();
  }, [service, start, state.status]);

  useEffect(() => {
    if (state.status !== "connected") return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(timer);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "connected") return;
    const timeout = window.setTimeout(() => void end("timeout"), SESSION_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [end, state.status]);

  useEffect(() => {
    if (state.status !== "connected") return;
    let frame = 0;
    const readAudioLevel = () => {
      if (!service.isActive) return;
      const level = state.activity === "speaking" ? service.getOutputVolume() : service.getInputVolume();
      dispatch({ type: "audio-level", level: Math.min(1, Math.max(0, level)) });
      frame = window.requestAnimationFrame(readAudioLevel);
    };
    frame = window.requestAnimationFrame(readAudioLevel);
    return () => window.cancelAnimationFrame(frame);
  }, [service, state.activity, state.status]);

  useEffect(() => () => {
    endingRef.current = true;
    void service.end();
  }, [service]);

  return { state, start, end, retry, toggleMute };
}

export type VoiceAgentViewState = VoiceAgentClientState & {
  status: VoiceSessionStatus;
  permission: VoicePermissionStatus;
};
