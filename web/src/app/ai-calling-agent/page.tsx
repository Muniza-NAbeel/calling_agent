import Link from "next/link";

import { CtaBand } from "@/components/site";

export default function AiCallingAgentPage() {
  return (
    <main>
      <section className="ai-hero ds-hero-ground" aria-labelledby="ai-hero-title">
        <div className="ds-atmosphere" aria-hidden="true">
          <span className="ds-atmosphere-blob ds-blob-teal ds-blob-lg" />
          <span className="ds-atmosphere-blob ds-blob-mint ds-blob-md" />
          <span className="ds-atmosphere-blob ds-blob-signal ds-blob-sm" />
        </div>
        <div className="ai-hero-content ds-container">
          <p className="ds-eyebrow">AI calling agent</p>
          <h1 id="ai-hero-title" className="site-display site-display-small ai-hero-title">A voice conversation, ready on demand.</h1>
          <p className="site-lede ai-hero-lede">Let visitors speak directly with Hopenix&apos;s configured voice agent through a focused browser experience.</p>
          <Link className="ds-button ds-button-primary ai-hero-action" href="/contact">Talk to us</Link>
        </div>
      </section>
      <section className="site-section ai-live-section" aria-labelledby="ai-live-title">
        <div className="ds-container">
          <div className="ai-live-preview" aria-hidden="true">
            <p className="ds-eyebrow ai-live-kicker">Live conversation preview</p>
            <div className="ai-live-flow">
              <span className="ai-live-flow-stage"><span className="ai-live-flow-dot" />Listening</span>
              <span className="ai-live-flow-link"><span className="ai-live-flow-travel" /></span>
              <span className="ai-live-flow-stage"><span className="ai-live-flow-dot" />Understanding</span>
              <span className="ai-live-flow-link"><span className="ai-live-flow-travel" /></span>
              <span className="ai-live-flow-stage"><span className="ai-live-flow-dot" />Responding</span>
              <span className="ai-live-flow-link"><span className="ai-live-flow-travel" /></span>
              <span className="ai-live-flow-stage"><span className="ai-live-flow-dot" />Ready for handoff</span>
            </div>
          </div>
          <div className="ai-live-copy">
            <p className="ds-eyebrow">Designed for trust</p>
            <h2 id="ai-live-title" className="site-section-title">Clear controls for a live conversation.</h2>
            <p className="ds-section-description">The interface keeps interaction state visible while conversation configuration remains with the voice agent.</p>
            <Link className="site-inline-link" href="/how-it-works">Learn how the flow works <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
      <CtaBand title="Give your next caller a clearer first step." />
    </main>
  );
}