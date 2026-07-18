import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";

export default function ForbiddenPage() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold">403 — Forbidden</h1>
      <p className="mt-3 text-muted">You don&apos;t have permission to view this page.</p>
      <Link href="/dashboard" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </Container>
  );
}
