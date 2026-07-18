import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";

export default function UnauthorizedPage() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold">401 — Unauthorized</h1>
      <p className="mt-3 text-muted">Please sign in to continue.</p>
      <Link href="/login" className="mt-6">
        <Button>Go to login</Button>
      </Link>
    </Container>
  );
}
