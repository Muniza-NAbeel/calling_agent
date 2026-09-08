import Link from "next/link";

import { Card, Reveal } from "@/design-system/components";
import { VoiceAgent } from "@/features/voice-agent/components/voice-agent";

const capabilities = [
  ["Natural conversation", "Let people speak normally through a focused voice interface."],
  ["Visible session state", "Keep connection, activity, permission, and error states clear."],
  ["Provider boundary", "Keep agent configuration and conversation knowledge outside the client."],
];

const useCases = [
  ["Voice access", "Offer a direct browser entry point into the configured voice experience."],
  ["Session visibility", "Make live activity and call lifecycle easy to understand."],
  ["Operational boundary", "Keep provider credentials and agent knowledge on the server side."],
];

export default function Home() {
  return (
    <main>
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="ds-container landing-hero-grid">
          <div className="landing-hero-copy ds-animate-enter">
            <p className="ds-eyebrow">Hopenix AI Calling Agent</p>
            <h1 id="hero-title" className="site-display">A clearer way to start a voice conversation.</h1>
            <p className="site-lede">Hopenix gives people a focused voice interface while the configured agent remains the source of truth for conversation behavior and knowledge.</p>
            <div className="site-actions">
              <Link className="ds-button ds-button-primary" href="/ai-calling-agent">Talk to the AI agent <span aria-hidden="true">↗</span></Link>
              <Link className="ds-button ds-button-secondary" href="/contact">Plan your use case</Link>
            </div>
            <p className="landing-hero-note"><span aria-hidden="true">●</span> Voice interaction with a clear system boundary</p>
          </div>
          <div className="landing-hero-visual ds-animate-enter"><VoiceAgent /></div>
        </div>
      </section>

      <section className="landing-capability-strip" aria-label="Core capabilities">
        <div className="ds-container landing-capability-grid">
          {capabilities.map(([title, description], index) => (
            <Reveal className="landing-capability-reveal" delay={index * 90} key={title}>
              <article className="landing-capability">
                <div className="landing-capability-kicker" aria-hidden="true"><span className="landing-index">0{index + 1}</span><span className="landing-capability-rule" /></div>
                <h2>{title}</h2>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="site-section" aria-labelledby="works-title">
        <div className="ds-container">
          <div className="landing-section-intro"><div><p className="ds-eyebrow">How it works</p><h2 id="works-title" className="site-section-title">A focused path into the conversation.</h2></div><p>Hopenix keeps the browser experience simple and the agent boundary clear.</p></div>
          <div className="landing-step-grid">
            <article><span className="landing-step-number">01</span><h3>Request permission</h3><p>The browser asks for microphone access before the session can begin.</p></article>
            <article><span className="landing-step-number">02</span><h3>Start the session</h3><p>The interface connects to the configured agent and reflects its activity.</p></article>
            <article><span className="landing-step-number">03</span><h3>Control the lifecycle</h3><p>The user can end the session, retry the connection, or respond to an error.</p></article>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="landing-workflow-section" aria-labelledby="workflow-title">
        <div className="ds-container landing-workflow-grid">
          <div><p className="ds-eyebrow">Automation workflow</p><h2 id="workflow-title" className="site-section-title">The useful work happens between the words.</h2><p className="site-lede">From the first question to the final next step, Hopenix gives conversations structure without making them feel structured.</p><Link className="site-inline-link landing-light-link" href="/how-it-works">Explore the workflow <span aria-hidden="true">→</span></Link></div>
          <ol className="landing-flow-card" aria-label="Hopenix automation workflow">
            <li className="landing-flow-item"><span className="landing-flow-number" aria-hidden="true">01</span><div className="landing-flow-copy"><strong>Incoming Call</strong><p>The conversation begins in the voice channel.</p></div></li>
            <li className="landing-flow-item"><span className="landing-flow-number" aria-hidden="true">02</span><div className="landing-flow-copy"><strong>Understand Caller</strong><p>Listen for intent, context, and urgency.</p></div></li>
            <li className="landing-flow-item"><span className="landing-flow-number" aria-hidden="true">03</span><div className="landing-flow-copy"><strong>Search Approved Knowledge</strong><p>Ground the next response in configured information.</p></div></li>
            <li className="landing-flow-item"><span className="landing-flow-number" aria-hidden="true">04</span><div className="landing-flow-copy"><strong>Respond Naturally</strong><p>Keep the exchange clear, useful, and conversational.</p></div></li>
            <li className="landing-flow-item"><span className="landing-flow-number" aria-hidden="true">05</span><div className="landing-flow-copy"><strong>Guide / Resolve</strong><p>Move the caller toward a useful next step.</p></div></li>
            <li className="landing-flow-item"><span className="landing-flow-number" aria-hidden="true">06</span><div className="landing-flow-copy"><strong>Detect Need for Human</strong><p>Recognize when automation should step aside.</p></div></li>
            <li className="landing-flow-item"><span className="landing-flow-number" aria-hidden="true">07</span><div className="landing-flow-copy"><strong>Transfer to Human</strong><p>Pass the conversation into the configured handoff path.</p></div></li>
          </ol>
        </div>
      </Reveal>

      <Reveal as="section" className="site-section" aria-labelledby="handoff-title">
        <div className="ds-container landing-handoff-grid">
          <Card raised className="landing-handoff-card"><div className="landing-handoff-header"><div className="landing-signal-mark" aria-hidden="true"><span /><span /><span /></div><p className="ds-eyebrow">System boundary</p></div><h2 id="handoff-title" className="site-section-title">The browser stays focused on interaction.</h2><p className="site-lede">The client owns permissions, session state, provider events, errors, and call lifecycle. Conversation knowledge remains with the configured agent.</p><Link className="site-inline-link" href="/ai-calling-agent">See the agent experience <span aria-hidden="true">→</span></Link></Card>
          <div className="landing-handoff-copy"><p className="landing-quote">“I need someone from your team.”</p><p className="landing-quote-answer">That request is not a failure state. It is a clear signal to connect the right person.</p><div className="landing-handoff-line"><span className="landing-handoff-pulse" aria-hidden="true" /><span>Conversation context can move with the caller.</span></div></div>
        </div>
      </Reveal>

      <Reveal as="section" className="site-section landing-benefits-section" aria-labelledby="benefits-title">
        <div className="ds-container"><p className="ds-eyebrow">Business benefits</p><h2 id="benefits-title" className="site-section-title">More useful conversations. Less repetitive work.</h2><div className="site-card-grid site-card-grid-three"><Card><p className="site-card-kicker">01</p><h3 className="site-card-title">Help customers sooner</h3><p className="site-card-copy">Give people a clear response at the moment they reach out.</p></Card><Card><p className="site-card-kicker">02</p><h3 className="site-card-title">Give teams better context</h3><p className="site-card-copy">Capture the shape of a request before a representative takes over.</p></Card><Card><p className="site-card-kicker">03</p><h3 className="site-card-title">Keep quality intentional</h3><p className="site-card-copy">Build the voice experience around knowledge your business has reviewed.</p></Card></div></div>
      </Reveal>

      <Reveal as="section" className="site-section" aria-labelledby="use-cases-title">
        <div className="ds-container"><div className="landing-section-intro"><div><p className="ds-eyebrow">Use cases</p><h2 id="use-cases-title" className="site-section-title">Start with the conversations you already repeat.</h2></div><Link className="site-inline-link" href="/use-cases">View all use cases <span aria-hidden="true">→</span></Link></div><div className="site-card-grid site-card-grid-three">{useCases.map(([title, description], index) => <Card key={title}><p className="site-card-kicker">0{index + 1}</p><h3 className="site-card-title">{title}</h3><p className="site-card-copy">{description}</p></Card>)}</div></div>
      </Reveal>

      <Reveal as="section" className="landing-technology" aria-labelledby="technology-title">
        <div className="ds-container landing-technology-grid"><div><p className="ds-eyebrow">Trust the architecture</p><h2 id="technology-title" className="site-section-title">A clear boundary between interface and agent.</h2><p className="site-lede">Provider credentials stay server-side, while the public voice surface manages only the interaction contract.</p></div><div className="landing-technology-list"><div><strong>Session</strong><span>Connection and call lifecycle</span></div><div><strong>Events</strong><span>Provider activity reflected in the UI</span></div><div><strong>Configuration</strong><span>Kept outside the client bundle</span></div></div></div>
      </Reveal>

      <Reveal as="section" className="site-cta-band landing-final-cta" aria-labelledby="final-cta-title"><div className="ds-container site-cta-content"><div><p className="ds-eyebrow">Make the next call clearer</p><h2 id="final-cta-title" className="site-section-title">Give customers a better way to reach you.</h2><p>Start with the agent, then shape the workflow around your business.</p></div><Link className="ds-button ds-button-primary" href="/contact">Talk to Hopenix <span aria-hidden="true">↗</span></Link></div></Reveal>
    </main>
  );
}
