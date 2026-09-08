import { ContentSection, LegalPage } from "@/components/site";

export default function PrivacyPage() {
  return <LegalPage eyebrow="Legal" title="Privacy at Hopenix." description="Privacy content is managed outside the frontend application and is not embedded in the voice client.">
    <ContentSection title="Privacy information"><div className="site-prose"><p>The frontend contains no private knowledge, internal instructions, or policy content. Published privacy information should be served through the approved secure content boundary.</p></div></ContentSection>
  </LegalPage>;
}
