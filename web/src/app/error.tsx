"use client";

import { Button, ErrorState } from "@/design-system/components";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="site-boundary"><ErrorState title="This page could not load" description="Please try again. The rest of Hopenix is still available." action={<Button type="button" onClick={reset}>Try again</Button>} /></main>;
}
