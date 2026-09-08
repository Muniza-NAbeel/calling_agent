"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/ai-calling-agent", label: "AI agent" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/features", label: "Features" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="ds-container site-header-inner">
        <Link className="site-logo" href="/" aria-label="Hopenix home" onClick={() => setIsOpen(false)}>
          <span className="site-logo-mark" aria-hidden="true">H</span>
          <span>hopenix</span>
        </Link>
        <nav id="main-navigation" className={`site-nav ${isOpen ? "site-nav-open" : ""}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>
          ))}
          <Link className="ds-button ds-button-primary site-nav-cta" href="/contact" onClick={() => setIsOpen(false)}>Talk to us</Link>
        </nav>
        <button
          className="site-menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="main-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span aria-hidden="true">{isOpen ? "Close" : "Menu"}</span>
        </button>
      </div>
    </header>
  );
}
