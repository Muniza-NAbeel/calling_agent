import { ContentSection, CtaBand, InfoCard } from "@/components/site";

export default function FeaturesPage() {
  return (
    <main>
      <section className="ft-hero ds-hero-ground" aria-labelledby="ft-hero-title">
        <div className="ds-atmosphere" aria-hidden="true">
          <span className="ds-atmosphere-blob ds-blob-teal ds-blob-lg" />
          <span className="ds-atmosphere-blob ds-blob-cloud ds-blob-md" />
          <span className="ds-atmosphere-blob ds-blob-mint ds-blob-sm" />
        </div>
        <div className="ft-hero-content ds-container">
          <p className="ds-eyebrow">Features</p>
          <h1 id="ft-hero-title" className="site-display site-display-small ft-title">The essentials for a dependable voice operation.</h1>
          <p className="site-lede ft-lede">A focused foundation for teams that want automation to feel considered, observable, and easy to extend.</p>
        </div>
      </section>
      <ContentSection title="A practical foundation" description="The product architecture keeps the public experience light while the server owns provider integrations and sensitive configuration.">
        <div className="site-card-grid site-card-grid-two"><InfoCard number="01" title="Website voice experience" description="Give visitors a direct, isolated voice interaction without exposing provider secrets." /><InfoCard number="02" title="Session controls" description="Keep microphone permission, call state, activity, and errors visible to the user." /><InfoCard number="03" title="Agent event handling" description="Reflect provider events in the interface without embedding their business meaning." /><InfoCard number="04" title="Typed integration boundaries" description="Keep presentation, domain, provider, and infrastructure concerns independently evolvable." /></div>
      </ContentSection>
      <CtaBand />
    </main>
  );
}
