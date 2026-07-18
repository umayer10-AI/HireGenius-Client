import { Container, Card, SectionTitle } from "@/components/ui/Primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <SectionTitle title="Privacy Policy" description="How HireGenius AI collects, uses, and protects your data." />
      <Card className="space-y-4 text-sm leading-relaxed text-muted">
        <p>
          We collect account details, profile information, application materials, and usage analytics required to operate the platform.
        </p>
        <p>
          Uploaded resumes and images are stored securely via Cloudinary. Authentication sessions use secure HTTP-only cookies via Better Auth.
        </p>
        <p>
          We never sell personal data. You can request account deletion from settings or by contacting support.
        </p>
      </Card>
    </Container>
  );
}
