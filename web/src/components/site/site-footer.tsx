import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="ds-container site-footer-grid">
        <div>
          <Link className="site-logo site-logo-footer" href="/">
            <span className="site-logo-mark" aria-hidden="true">H</span>
            <span>hopenix</span>
          </Link>
          <p className="site-footer-copy">Thoughtful voice automation for better business conversations.</p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer navigation">
          <div><p className="site-footer-heading">Explore</p><Link href="/ai-calling-agent">AI agent</Link><Link href="/how-it-works">How it works</Link><Link href="/use-cases">Use cases</Link><Link href="/features">Features</Link></div>
          <div><p className="site-footer-heading">Connect</p><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        </nav>
      </div>
      <div className="ds-container site-footer-bottom"><span>© {new Date().getFullYear()} Hopenix. All rights reserved.</span><span>Voice automation, with a human point of view.</span></div>
    </footer>
  );
}
