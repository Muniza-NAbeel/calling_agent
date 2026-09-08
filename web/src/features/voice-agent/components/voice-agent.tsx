"use client";

import type { CSSProperties } from "react";

import type { VoiceAgentActivity, VoiceSessionStatus } from "@/domain/voice-agent";

import { trackVoiceAnalytics } from "../services/analytics";
import { useVoiceAgentSession } from "../hooks/use-voice-agent-session";

const twentyOne = 21;

const statusCopy: Record<VoiceSessionStatus, string> = {
  idle: "Ready when you are.",
  connecting: "Setting up a secure conversation...",
  connected: "Connected to Hopenix.",
  ending: "Ending the conversation...",
  disconnected: "The conversation has ended.",
  error: "The conversation needs your attention.",
};

const activityCopy: Record<VoiceAgentActivity, string> = {
  idle: "Ready when you are.",
  listening: "Listening for your voice...",
  speaking: "Hopenix is speaking...",
  interrupted: "Listening again...",
};

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function visualLabel(status: VoiceSessionStatus, activity: VoiceAgentActivity): string {
  if (status === "connecting") return "Connecting to Hopenix";
  if (status === "ending") return "Ending conversation";
  if (status === "disconnected") return "Conversation disconnected";
  if (status === "error") return "Voice agent unavailable";
  if (activity === "speaking") return "Hopenix is speaking";
  if (activity === "interrupted") return "Conversation interrupted, listening again";
  if (activity === "listening") return "Listening for your voice";
  return "Voice agent ready";
}

export function VoiceAgent() {
  const { state, start, end, retry, toggleMute } = useVoiceAgentSession();
  const isActive = state.status === "connected";
  const isBusy = state.status === "connecting" || state.status === "ending";
  const canStart = state.status === "idle" || state.status === "disconnected" || state.status === "error";
  const level = isActive ? state.audioLevel : 0;
  const transferMessage = state.transferStatus === "in_progress"
    ? "Connecting you with a human representative..."
    : state.transferStatus === "completed"
      ? "A human representative has joined the conversation."
      : state.transferStatus === "failed"
        ? state.transferError ?? "The human transfer could not be completed."
        : undefined;

  return (
    <section className="voice-agent-card" aria-labelledby="voice-agent-title">
      <div className="voice-agent-header">
        <div className="voice-agent-identity">
          <div className="voice-agent-avatar" aria-hidden="true">H</div>
          <div>
            <span className="voice-agent-label"><span className={`voice-agent-dot voice-agent-dot-${state.status}`} aria-hidden="true" />Hopenix voice agent</span>
            <h2 id="voice-agent-title" className="voice-agent-title">Talk to Hopenix</h2>
            <p className="voice-agent-status" aria-live="polite">{isActive ? activityCopy[state.activity] : statusCopy[state.status]}</p>
          </div>
        </div>
        <span className="voice-agent-duration" aria-label={`Call duration ${formatDuration(state.durationSeconds)}`}>{formatDuration(state.durationSeconds)}</span>
      </div>

      <div className={`voice-agent-visual voice-agent-visual-${state.activity}`} role="img" aria-label={visualLabel(state.status, state.activity)}>
        <div className="voice-agent-orbit voice-agent-orbit-one" aria-hidden="true" />
        <div className="voice-agent-orbit voice-agent-orbit-two" aria-hidden="true" />
        <div className="voice-agent-bars" aria-hidden="true">
          {Array.from({ length: twentyOne }, (_, index) => <span key={index} style={{ "--bar-index": index, "--voice-level": level } as CSSProperties} />)}
        </div>
      </div>

      <div className="voice-agent-prompt" aria-live="polite">
        <span>{state.status === "error" ? "Connection status" : "Conversation status"}</span>
        <p role={state.status === "error" ? "alert" : undefined}>{state.status === "error" ? state.errorMessage : isActive ? activityCopy[state.activity] : statusCopy[state.status]}</p>
      </div>

      {state.permission === "denied" && state.status === "error" ? <p className="voice-agent-permission">Microphone access is blocked. Allow microphone access in your browser settings, then try again.</p> : null}

      {transferMessage ? <p className={`voice-agent-transfer voice-agent-transfer-${state.transferStatus}`} role={state.transferStatus === "failed" ? "alert" : "status"} aria-live="polite">
        <span aria-hidden="true">{state.transferStatus === "failed" ? "!" : state.transferStatus === "completed" ? "✓" : "↗"}</span>
        {transferMessage}
      </p> : null}

      <div className="voice-agent-actions">
        {canStart ? <button className="ds-button ds-button-primary voice-agent-button" type="button" onClick={() => { trackVoiceAnalytics("ai_call_cta_clicked"); void start(); }}>{state.status === "error" ? "Try again" : "Call AI"}<span aria-hidden="true">↗</span></button> : null}
        {isActive || state.status === "ending" ? <button className="ds-button ds-button-danger voice-agent-button" type="button" onClick={() => void end()} disabled={state.status === "ending"}>{state.status === "ending" ? "Ending call..." : "End call"}</button> : null}
        {isActive ? <button className="ds-button ds-button-secondary voice-agent-button" type="button" onClick={toggleMute}>{state.muted ? "Unmute microphone" : "Mute microphone"}</button> : null}
        {state.status === "error" ? <button className="ds-button ds-button-secondary voice-agent-button" type="button" onClick={retry}>Retry connection</button> : null}
      </div>

      <p className="voice-agent-note">Your browser will ask for microphone permission before the conversation starts.</p>
      {isBusy ? <span className="voice-agent-sr-status" role="status">{statusCopy[state.status]}</span> : null}
    </section>
  );
}
