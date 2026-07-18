import { Container, Card, SectionTitle } from "@/components/ui/Primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
};

export default function HelpPage() {
  return (
    <Container className="py-12">
      <SectionTitle title="Help Center" description="Quick answers for candidates and recruiters." />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["How do I apply to a job?", "Open a job detail page, write a cover letter, and submit. Your profile resume is used by default."],
          ["How do AI recommendations work?", "We analyze your skills, experience, and activity history to score open roles."],
          ["How do recruiters post jobs?", "Create a company, then use Post Job from the recruiter dashboard."],
          ["Need more help?", "Email hello@hiregenius.ai or use the contact form."],
        ].map(([title, text]) => (
          <Card key={title}>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
