"use client";

import { useEffect, useRef, type AriaAttributes, type HTMLAttributes, type ReactNode } from "react";

type RevealElement = "div" | "section";

export function Reveal({ children, className = "", delay = 0, as = "div", ...rest }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealElement;
} & AriaAttributes) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-in-view");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.classList.add("is-in-view");
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -56px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const shared: HTMLAttributes<HTMLElement> = {
    className: `ds-reveal ${className}`,
    ...rest,
    style: delay ? { transitionDelay: `${delay}ms` } : undefined,
  };

  if (as === "section") {
    return <section ref={ref} {...shared}>{children}</section>;
  }
  return <div ref={(node) => { ref.current = node; }} {...shared}>{children}</div>;
}