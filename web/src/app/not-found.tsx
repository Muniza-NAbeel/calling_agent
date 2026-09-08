import Link from "next/link";

export default function NotFound() {
  return <main className="site-boundary"><div className="site-boundary-copy"><p className="ds-eyebrow">404</p><h1 className="site-section-title">That page is not here.</h1><p className="site-lede">The address may have changed, but the next useful conversation is close by.</p><Link className="ds-button ds-button-primary" href="/">Back to Hopenix</Link></div></main>;
}
