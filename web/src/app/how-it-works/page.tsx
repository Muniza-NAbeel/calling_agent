import { ContentSection, CtaBand, InfoCard } from "@/components/site";

export default function HowItWorksPage() {
  return (
    <main>
      <section className="hiw-hero ds-hero-ground" aria-labelledby="hiw-hero-title">
        <div className="ds-atmosphere" aria-hidden="true">
          <span className="ds-atmosphere-blob ds-blob-cloud ds-blob-lg" />
          <span className="ds-atmosphere-blob ds-blob-teal ds-blob-md" />
          <span className="ds-atmosphere-blob ds-blob-mint ds-blob-sm" />
        </div>
        <div className="hiw-hero-content ds-container">
          <p className="ds-eyebrow">How it works</p>
          <h1 id="hiw-hero-title" className="site-display site-display-small hiw-title">A simple path into a voice conversation.</h1>
          <p className="site-lede hiw-lede">Hopenix keeps the browser responsible for interaction and session state while the configured agent handles the conversation.</p>
        </div>
      </section>
      <ContentSection title="Three intentional steps" description="Every part of the browser flow has a clear job, with provider configuration kept outside the client.">
        <div className="site-card-grid site-card-grid-three"><InfoCard number="01" title="Request permission" description="The browser asks for microphone access before a conversation can begin." /><InfoCard number="02" title="Start a session" description="The interface connects to the configured voice agent and reflects its activity." /><InfoCard number="03" title="End or recover" description="The user can end the call, retry the connection, or respond to an error." /></div>
      </ContentSection>
      <CtaBand />
    </main>
  );
}