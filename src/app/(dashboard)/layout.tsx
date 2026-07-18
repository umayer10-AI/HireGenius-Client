"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  FileCheck,
  FileBarChart,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  PenLine,
  PlusCircle,
  Settings,
  Sparkles,
  Sun,
  Target,
  User,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ADMIN_NAV, APP_NAME, CANDIDATE_NAV, RECRUITER_NAV } from "@/constants";
import { useAuth } from "@/providers/AuthProvider";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Badge, Spinner } from "@/components/ui/Primitives";

const iconMap = {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  FileText,
  Sparkles,
  PenLine,
  Target,
  MessageSquare,
  Bell,
  Settings,
  Building2,
  PlusCircle,
  Users,
  BarChart3,
  FileCheck,
  FileBarChart,
} as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loading || isPending) return;
    if (!session?.user && !user) {
      router.replace("/login");
    }
  }, [loading, isPending, session?.user?.id, user, router]);

  const nav = useMemo(() => {
    if (!user) return CANDIDATE_NAV;
    if (user.role === "admin") return ADMIN_NAV;
    if (user.role === "recruiter") return RECRUITER_NAV;
    return CANDIDATE_NAV;
  }, [user]);

  if (loading || isPending || (!user && !session?.user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const Sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-card/60 p-4">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl gradient-primary text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="font-semibold">{APP_NAME}</span>
      </Link>
      {user?.role ? (
        <div className="mb-4 px-2">
          <Badge tone={user.role === "recruiter" ? "secondary" : user.role === "admin" ? "accent" : "primary"}>
            {user.role}
          </Badge>
        </div>
      ) : null}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm transition",
                active ? "bg-primary/15 text-primary" : "text-muted hover:bg-border/40 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Button variant="outline" className="mt-4" onClick={() => logout()}>
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[288px_1fr]">
      <div className="hidden lg:block">{Sidebar}</div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">{Sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border glass px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full p-2 lg:hidden"
              aria-label="Open sidebar"
              onClick={() => setOpen(true)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Dashboard</p>
              <h1 className="text-sm font-semibold md:text-base">
                Welcome, {user?.name || session?.user?.name || "there"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              className="rounded-full p-2 text-muted hover:bg-border/50"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <Link href="/dashboard/notifications" className="rounded-full p-2 text-muted hover:bg-border/50">
              <Bell className="h-4 w-4" />
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {(user?.name || session?.user?.name || "U").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
