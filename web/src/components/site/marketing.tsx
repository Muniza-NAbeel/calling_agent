import type { ReactNode } from "react";
import Link from "next/link";

import { Card, Reveal, SectionHeader } from "@/design-system/components";

export function LegalPage({ eyebrow, title, description, children }: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return <main><section className="legal-hero site-hero-center ds-hero-ground" aria-labelledby="legal-hero-title"><div className="ds-atmosphere" aria-hidden="true"><span className="ds-atmosphere-blob ds-blob-teal ds-blob-lg" /><span className="ds-atmosphere-blob ds-blob-signal ds-blob-md" /><span className="ds-atmosphere-blob ds-blob-mint ds-blob-sm" /></div><div className="site-hero-center-content ds-container"><p className="ds-eyebrow">{eyebrow}</p><h1 id="legal-hero-title" className="site-display site-display-small site-hero-center-title">{title}</h1><p className="site-lede site-hero-center-lede">{description}</p></div></section>{children}</main>;
}

export function ContentSection({ eyebrow, title, description, children }: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return <Reveal as="section" className="site-section"><div className="ds-container"><SectionHeader eyebrow={eyebrow} title={title} description={description} />{children}</div></Reveal>;
}

export function CtaBand({ title = "Ready to make every conversation count?" }: { title?: string }) {
  return <Reveal as="section" className="site-cta-band"><div className="ds-atmosphere" aria-hidden="true"><span className="ds-atmosphere-blob ds-blob-teal ds-blob-lg" /><span className="ds-atmosphere-blob ds-blob-signal ds-blob-md" /></div><div className="ds-container site-cta-content"><h2 className="site-section-title">{title}</h2><Link className="ds-button ds-button-primary" href="/contact">Talk to Hopenix</Link></div></Reveal>;
}

export function InfoCard({ number, title, description }: { number: string; title: string; description: string }) {
  return <Card><p className="site-card-kicker">{number}</p><h3 className="site-card-title">{title}</h3><p className="site-card-copy">{description}</p></Card>;
}
