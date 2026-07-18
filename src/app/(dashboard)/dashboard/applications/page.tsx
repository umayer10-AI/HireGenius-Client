"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@/types";
import { Badge, Card, EmptyState, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ApplicationsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const query = useQuery({
    queryKey: ["applications", page, limit],
    queryFn: () => api.get<Application[]>("/api/applications", { page, limit }),
  });

  if (query.isLoading) return <Skeleton className="h-72" />;
  if (query.isError) {
    return (
      <EmptyState
        title="Could not load applications"
        description={query.error instanceof Error ? query.error.message : "Try again"}
        action={<Button onClick={() => query.refetch()}>Retry</Button>}
      />
    );
  }

  if (!query.data?.data.length) {
    return (
      <EmptyState
        title="No applications yet"
        description="Apply to a role and track every status update here."
        action={
          <Button onClick={() => router.push("/jobs")}>Browse jobs</Button>
        }
      />
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Applied jobs</h2>
      <div className="overflow-x-auto rounded-[20px] border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border text-muted">
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Applied</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {query.data.data.map((app) => (
              <tr key={app._id} className="border-b border-border/70 hover:bg-border/20">
                <td className="px-4 py-3 font-medium">{app.job?.title || "Role"}</td>
                <td className="px-4 py-3 text-muted">{app.job?.companyName || "—"}</td>
                <td className="px-4 py-3 text-muted">{formatDate(app.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge>{app.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {query.data.meta ? (
        <Pagination
          meta={query.data.meta}
          onPageChange={(next) => router.push(`/dashboard/applications?page=${next}&limit=${limit}`)}
          onLimitChange={(next) => router.push(`/dashboard/applications?page=1&limit=${next}`)}
        />
      ) : null}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72" />}>
      <ApplicationsInner />
    </Suspense>
  );
}
