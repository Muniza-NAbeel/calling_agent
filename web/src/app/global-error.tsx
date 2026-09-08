"use client";

import { Button, ErrorState } from "@/design-system/components";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="site-boundary">
          <ErrorState
            title="Hopenix could not load"
            description="Something went wrong while loading the application. Please try again."
            action={<Button type="button" onClick={reset}>Try again</Button>}
          />
        </main>
      </body>
    </html>
  );
}