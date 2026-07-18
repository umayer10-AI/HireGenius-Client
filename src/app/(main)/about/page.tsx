import { Container, SectionTitle, Card } from "@/components/ui/Primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how HireGenius AI helps candidates and recruiters hire smarter.",
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="About HireGenius"
        title="A premium AI hiring OS for modern careers"
        description="We built HireGenius AI to remove noise from job search and recruiting — with context-aware AI, clean workflows, and production-grade reliability."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            title: "For candidates",
            text: "Search smarter, generate resumes and cover letters, get match explanations, and prepare for interviews with an AI coach that knows your profile.",
          },
          {
            title: "For recruiters",
            text: "Post roles faster with AI job descriptions, review applicants in one place, and score candidate fit with transparent recommendations.",
          },
          {
            title: "For platforms",
            text: "Secure auth, Cloudinary media, MongoDB Atlas, rate limiting, and a modular architecture ready for real SaaS scale.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
