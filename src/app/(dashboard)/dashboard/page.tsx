"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Card, Skeleton } from "@/components/ui/Primitives";
import { calculateLocalCompletion } from "@/lib/profile";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const COLORS = ["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function DashboardHomePage() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<Record<string, unknown>>("/api/dashboard"),
  });

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <h2 className="text-lg font-semibold">Dashboard unavailable</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          {query.error instanceof Error ? query.error.message : "The server is currently unavailable."}
        </p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-6 inline-flex items-center rounded-[14px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
        >
          Retry
        </button>
      </div>
    );
  }

  const data = query.data?.data as {
    stats?: Record<string, number>;
    charts?: {
      statusBreakdown?: Array<{ name: string; value: number }>;
      monthlyApplications?: Array<{ name: string; value: number }>;
      applicationsTrend?: Array<{ name: string; value: number }>;
      jobsByStatus?: Array<{ name: string; value: number }>;
      userGrowth?: Array<{ name: string; value: number }>;
      roleDistribution?: Array<{ name: string; value: number }>;
    };
  };

  const stats = data?.stats || {};
  const completion = user ? calculateLocalCompletion(user) : { percentage: 0, missing: [] as string[] };

  const statCards =
    user?.role === "admin"
      ? [
          { label: "Users", value: stats.users },
          { label: "Recruiters", value: stats.recruiters },
          { label: "Companies", value: stats.companies },
          { label: "Jobs", value: stats.jobs },
        ]
      : user?.role === "recruiter"
        ? [
            { label: "Jobs Posted", value: stats.jobsPosted },
            { label: "Active Jobs", value: stats.activeJobs },
            { label: "Applications", value: stats.applications },
            { label: "Companies", value: stats.companies },
          ]
        : [
            { label: "Applied Jobs", value: stats.appliedJobs },
            { label: "Saved Jobs", value: stats.savedJobs },
            { label: "Interviews", value: stats.interviews },
            { label: "Profile", value: `${completion.percentage}%` },
          ];

  const areaData =
    data?.charts?.monthlyApplications ||
    data?.charts?.applicationsTrend ||
    data?.charts?.userGrowth ||
    [];
  const pieData =
    data?.charts?.statusBreakdown ||
    data?.charts?.jobsByStatus ||
    data?.charts?.roleDistribution ||
    [];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {user?.role === "admin"
                ? "Platform command center"
                : user?.role === "recruiter"
                  ? "Hiring performance overview"
                  : "Your career command center"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Track momentum, act on opportunities, and keep your pipeline healthy.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.role === "candidate" ? (
              <>
                <Link href="/jobs">
                  <Button>Browse jobs</Button>
                </Link>
                <Link href="/dashboard/ai/chat">
                  <Button variant="outline">Ask AI coach</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/jobs/new">
                  <Button>Post a job</Button>
                </Link>
                <Link href="/dashboard/applicants">
                  <Button variant="outline">Review applicants</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value ?? 0}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#7C3AED" fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-semibold">Activity snapshot</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} />
              <YAxis stroke="var(--muted)" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
