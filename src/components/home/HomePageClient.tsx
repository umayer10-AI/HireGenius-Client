"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { Job } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge, Card, Container, SectionTitle } from "@/components/ui/Primitives";
import { JobCard } from "@/components/jobs/JobCard";
import { JOB_CATEGORIES } from "@/constants";

interface HomePageClientProps {
  featured: Job[];
  stats: {
    jobs: number;
    companies: number;
    candidates: number;
    recruiters: number;
    applications: number;
  };
  categories: Array<{ name: string; count: number }>;
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const display = inView ? value : 0;
  return <span ref={ref}>{display.toLocaleString()}</span>;
}

const faqs = [
  {
    q: "How does AI job matching work?",
    a: "HireGenius analyzes your skills, experience, saved roles, and applications to recommend jobs with transparent match scores and reasons.",
  },
  {
    q: "Can I generate an ATS-friendly resume?",
    a: "Yes. The AI Resume Builder creates professional, ATS-optimized resumes you can regenerate, shorten, expand, and download.",
  },
  {
    q: "Is HireGenius free for candidates?",
    a: "Candidates can search, apply, save jobs, and use core AI tools. Premium unlocks higher AI usage limits.",
  },
  {
    q: "Can recruiters post unlimited jobs?",
    a: "Recruiters can create a company profile, post jobs, manage applicants, and use AI job description and candidate match tools.",
  },
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Frontend Engineer",
    quote:
      "The AI recommendations felt personal. I landed interviews in two weeks with a sharper resume and better targeting.",
  },
  {
    name: "Jordan Blake",
    role: "Talent Lead",
    quote:
      "Applicant triage is dramatically faster. Match analysis helps our team focus on the strongest candidates first.",
  },
  {
    name: "Sofia Alvarez",
    role: "Product Designer",
    quote:
      "Clean UX, thoughtful filters, and the career assistant actually helped me prep for behavioral rounds.",
  },
];

export function HomePageClient({ featured, stats, categories }: HomePageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const categoryCards = useMemo(() => {
    if (categories.length) return categories.slice(0, 8);
    return JOB_CATEGORIES.slice(0, 8).map((name) => ({ name, count: 0 }));
  }, [categories]);

  const searchHref = `/jobs?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`;

  return (
    <div>
      <section className="relative min-h-[65vh] overflow-hidden bg-mesh">
        <Container className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4">AI-native hiring platform</Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              HireGenius AI
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Discover roles, craft winning applications, and get coached by an AI career assistant built for modern job search.
            </p>

            <form
              className="mt-8 grid gap-3 rounded-[20px] border border-border bg-card/80 p-3 shadow-xl backdrop-blur md:grid-cols-[1.2fr_1fr_1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = searchHref;
              }}
            >
              <Input
                placeholder="Search jobs, skills, titles"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search jobs"
              />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
              />
              <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
                <option value="">Category</option>
                {JOB_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Button type="submit" className="w-full md:w-auto">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[28px] border border-border bg-card p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Today&apos;s match quality</p>
                  <p className="text-3xl font-semibold gradient-text">94%</p>
                </div>
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                {["Senior Full Stack Engineer", "Product Designer", "ML Engineer"].map((title, i) => (
                  <motion.div
                    key={title}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-[16px] border border-border bg-background/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-xs text-muted">Recommended for your profile</p>
                      </div>
                      <Badge tone="accent">{95 - i * 4}% match</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="border-y border-border bg-card/30 py-10">
        <Container>
          <p className="mb-6 text-center text-sm uppercase tracking-[0.2em] text-muted">
            Trusted by modern teams
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {["Nimbus", "Pixelcraft", "SignalAI", "Orbit", "Lumen", "Northstar"].map((name) => (
              <div
                key={name}
                className="flex h-16 items-center justify-center rounded-[16px] border border-border bg-background/50 text-sm font-semibold text-muted transition hover:text-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionTitle
            eyebrow="Featured roles"
            title="Jobs worth applying to this week"
            description="Curated openings with strong growth potential and clear compensation bands."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featured.length ? (
              featured.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <Card className="sm:col-span-2 xl:col-span-4">
                <p className="text-muted">
                  Featured jobs will appear here once the API is connected. Explore the jobs board to get started.
                </p>
                <Link href="/jobs" className="mt-4 inline-block">
                  <Button>Browse all jobs</Button>
                </Link>
              </Card>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-mesh py-20">
        <Container>
          <SectionTitle
            eyebrow="Categories"
            title="Explore opportunities by discipline"
            description="Find roles across engineering, design, product, and AI."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((item) => (
              <Link key={item.name} href={`/jobs?category=${encodeURIComponent(item.name)}`}>
                <Card className="h-full hover:-translate-y-1">
                  <Briefcase className="mb-3 h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.count} open roles</p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionTitle
            align="center"
            eyebrow="AI toolkit"
            title="Everything you need to compete"
            description="Resume, cover letter, recommendations, and coaching — in one product."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: FileText, title: "AI Resume Builder", href: "/dashboard/ai/resume", text: "Generate ATS-ready resumes tailored to your target role." },
              { icon: PenIcon, title: "Cover Letters", href: "/dashboard/ai/cover-letter", text: "Write persuasive letters in friendly, professional, or formal tone." },
              { icon: Target, title: "Smart Recommendations", href: "/dashboard/ai/recommendations", text: "See why each role matches with transparent scoring." },
              { icon: MessageSquare, title: "Career Assistant", href: "/dashboard/ai/chat", text: "Ask about salary, interviews, and next career moves." },
            ].map((item) => (
              <Link key={item.title} href={item.href}>
                <Card className="h-full gradient-border">
                  <item.icon className="mb-4 h-6 w-6 text-secondary" />
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.text}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-card/40 py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Active Jobs", value: stats.jobs, icon: Briefcase },
              { label: "Companies", value: stats.companies, icon: Building2 },
              { label: "Candidates", value: stats.candidates, icon: Users },
              { label: "Recruiters", value: stats.recruiters, icon: Bot },
              { label: "Applications", value: stats.applications, icon: FileText },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-3 h-5 w-5 text-primary" />
                <p className="text-3xl font-semibold">
                  <Counter value={stat.value} />
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionTitle eyebrow="Stories" title="Loved by ambitious professionals" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="h-full">
                <p className="text-sm leading-relaxed text-muted">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mesh py-20">
        <Container>
          <SectionTitle eyebrow="Insights" title="Latest from the HireGenius blog" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "How AI Is Changing Modern Hiring",
                desc: "From keyword filters to contextual matching.",
                slug: "how-ai-is-changing-modern-hiring",
              },
              {
                title: "Building an ATS-Friendly Resume in 2026",
                desc: "Structure and proof points that still win interviews.",
                slug: "building-an-ats-friendly-resume-in-2026",
              },
              {
                title: "Remote Interview Playbook",
                desc: "Preparation rituals that highlight your strengths.",
                slug: "remote-interview-playbook-for-candidates",
              },
            ].map((post) => (
              <Card key={post.slug} className="h-full">
                <div className="mb-4 h-36 rounded-[16px] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20" />
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm text-muted">{post.desc}</p>
                <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm font-medium text-primary">
                  Read more →
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-8 rounded-[28px] border border-border bg-card p-8 md:grid-cols-[1.2fr_1fr] md:p-10">
            <div>
              <h2 className="text-3xl font-semibold">Stay ahead of the market</h2>
              <p className="mt-3 text-muted">
                Get weekly role picks, AI career tips, and hiring trends delivered to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <SectionTitle eyebrow="FAQ" title="Questions, answered" />
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((item, index) => (
              <div key={item.q} className="rounded-[16px] border border-border bg-card">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  {item.q}
                  <span className="text-primary">{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index ? (
                  <p className="border-t border-border px-5 py-4 text-sm text-muted">{item.a}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="overflow-hidden rounded-[28px] gradient-primary p-10 text-white md:p-14">
            <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
              Ready to hire smarter or land your next role?
            </h2>
            <p className="mt-3 max-w-xl text-white/80">
              Join HireGenius AI and put an intelligent career system to work for you today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button className="bg-white text-primary hover:bg-white/90">Join Now</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  Talk to us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function PenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const { api } = await import("@/lib/api");
          await api.post("/api/newsletter", { email });
          setStatus("Subscribed successfully.");
          setEmail("");
        } catch (error) {
          setStatus(error instanceof Error ? error.message : "Subscription failed");
        }
      }}
    >
      <Input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email"
      />
      <Button type="submit">Subscribe</Button>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
