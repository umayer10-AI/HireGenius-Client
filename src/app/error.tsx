"use client";

import { Button } from "@/components/ui/Button";
import { Card, Container } from "@/components/ui/Primitives";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <Card className="max-w-lg text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted">{error.message || "An unexpected error occurred."}</p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </Card>
    </Container>
  );
}
