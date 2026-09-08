import Link from "next/link";

import { Card, Reveal } from "@/design-system/components";

export default function ContactPage() {
  return (
    <main>
      <section className="contact-hero ds-hero-ground" aria-labelledby="contact-hero-title">
        <div className="ds-atmosphere" aria-hidden="true">
          <span className="ds-atmosphere-blob ds-blob-cloud ds-blob-lg" />
          <span className="ds-atmosphere-blob ds-blob-teal ds-blob-md" />
          <span className="ds-atmosphere-blob ds-blob-mint ds-blob-sm" />
        </div>
        <div className="contact-hero-content ds-container">
          <p className="ds-eyebrow">Contact</p>
          <h1 id="contact-hero-title" className="site-display site-display-small contact-hero-title">Choose your next step.</h1>
          <p className="site-lede contact-hero-lede">Open the voice experience or review the frontend boundary before connecting it to a workflow.</p>
        </div>
      </section>

      <Reveal as="section" className="site-section" aria-labelledby="contact-actions-title">
        <div className="ds-container">
          <h2 id="contact-actions-title" className="site-section-title contact-section-title">Start with the right next step</h2>
          <div className="site-card-grid site-card-grid-two contact-choice-grid">
            <Card raised className="contact-choice-card">
              <p className="site-card-kicker">Explore the experience</p>
              <h3 className="site-card-title">Talk to the AI agent</h3>
              <p className="site-card-copy">See the public voice flow and its session controls.</p>
              <Link className="ds-button ds-button-primary contact-choice-action" href="/ai-calling-agent">Open the agent</Link>
            </Card>
            <Card raised className="contact-choice-card">
              <p className="site-card-kicker">Review the boundary</p>
              <h3 className="site-card-title">Inspect the frontend role</h3>
              <p className="site-card-copy">See which responsibilities stay in the browser and which remain with the configured agent.</p>
              <Link className="ds-button ds-button-secondary contact-choice-action" href="/use-cases">Review the boundary →</Link>
            </Card>
          </div>
        </div>
      </Reveal>
    </main>
  );
}