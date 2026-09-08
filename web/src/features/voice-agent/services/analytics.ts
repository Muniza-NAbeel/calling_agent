"use client";

export type VoiceAnalyticsEvent =
  | "ai_call_cta_clicked"
  | "call_started"
  | "call_connected"
  | "call_ended"
  | "call_failed"
  | "transfer_requested"
  | "transfer_completed"
  | "transfer_failed";

export interface AnalyticsProvider {
  track(event: VoiceAnalyticsEvent): void;
}

const consentKey = "hopenix.analytics.consent";
let provider: AnalyticsProvider | null = null;

export function setAnalyticsProvider(nextProvider: AnalyticsProvider | null): void {
  provider = nextProvider;
}

export function grantAnalyticsConsent(): void {
  window.localStorage.setItem(consentKey, "granted");
}

export function revokeAnalyticsConsent(): void {
  window.localStorage.removeItem(consentKey);
}

export function hasAnalyticsConsent(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(consentKey) === "granted";
}

export function trackVoiceAnalytics(event: VoiceAnalyticsEvent): void {
  if (!hasAnalyticsConsent()) return;
  provider?.track(event);
}