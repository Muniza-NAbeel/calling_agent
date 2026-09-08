import { ContentSection, LegalPage } from "@/components/site";

export default function TermsPage() {
  return <LegalPage eyebrow="Legal" title="Terms for using Hopenix." description="Terms content is managed outside the frontend application and is not embedded in the voice client.">
    <ContentSection title="Terms information"><div className="site-prose"><p>The frontend contains no private knowledge, internal instructions, or business policy content. Published terms should be served through the approved secure content boundary.</p></div></ContentSection>
  </LegalPage>;
}
