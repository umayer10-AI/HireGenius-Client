"use client";

import { Button } from "@/components/ui/Button";
import { Card, Container } from "@/components/ui/Primitives";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="text-xl font-semibold">This page failed to load</h2>
        <p className="mt-2 text-sm text-muted">{error.message}</p>
        <Button className="mt-6" onClick={reset}>
          Retry
        </Button>
      </Card>
    </Container>
  );
}
