import { ContentSection, CtaBand, InfoCard } from "@/components/site";

export default function UseCasesPage() {
  return (
    <main>
      <section className="uc-hero ds-hero-ground" aria-labelledby="uc-hero-title">
        <div className="ds-atmosphere" aria-hidden="true">
          <span className="ds-atmosphere-blob ds-blob-teal ds-blob-lg" />
          <span className="ds-atmosphere-blob ds-blob-mint ds-blob-md" />
          <span className="ds-atmosphere-blob ds-blob-signal ds-blob-sm" />
        </div>
        <div className="uc-hero-content ds-container">
          <p className="ds-eyebrow">Use cases</p>
          <h1 id="uc-hero-title" className="site-display site-display-small uc-title">A voice interface for your chosen workflow.</h1>
          <p className="site-lede uc-lede">The browser provides a focused entry point without embedding the workflow&apos;s private knowledge or rules.</p>
        </div>
      </section>
      <ContentSection title="Keep the client focused" description="Configure conversation behavior in the agent and keep the frontend responsible for interaction state.">
        <div className="site-card-grid site-card-grid-three"><InfoCard number="01" title="Voice access" description="Provide a direct entry point into the configured agent experience." /><InfoCard number="02" title="Session visibility" description="Show connection, activity, permission, and error state clearly." /><InfoCard number="03" title="Typed boundaries" description="Expose future backend context only through secure typed APIs." /></div>
      </ContentSection>
      <CtaBand title="Find the first workflow worth improving." />
    </main>
  );
}
