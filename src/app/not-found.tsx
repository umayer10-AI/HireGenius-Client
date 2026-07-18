import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20" />
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>Go home</Button>
        </Link>
        <Link href="/jobs">
          <Button variant="outline">Search jobs</Button>
        </Link>
      </div>
    </Container>
  );
}
