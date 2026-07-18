import Link from "next/link";
import { Globe, Link2, Share2, Sparkles } from "lucide-react";
import { APP_NAME } from "@/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="container-app grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl gradient-primary text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold">{APP_NAME}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            The AI-powered job portal that helps candidates land roles faster and helps recruiters hire with confidence.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Product</h4>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <Link href="/jobs">Browse Jobs</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/dashboard/ai/chat">Career Assistant</Link>
            <Link href="/dashboard/ai/resume">AI Resume Builder</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/help">Help Center</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/help">Terms of Service</Link>
          </div>
          <div className="mt-6 flex gap-3">
            <a aria-label="Website" href="https://hiregenius.ai" className="rounded-full border border-border p-2 text-muted hover:text-foreground">
              <Globe className="h-4 w-4" />
            </a>
            <a aria-label="Share" href="https://linkedin.com" className="rounded-full border border-border p-2 text-muted hover:text-foreground">
              <Share2 className="h-4 w-4" />
            </a>
            <a aria-label="Links" href="https://github.com" className="rounded-full border border-border p-2 text-muted hover:text-foreground">
              <Link2 className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
