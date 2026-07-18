"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Job } from "@/types";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface SavedItem {
  _id: string;
  job: Job | null;
}

function SavedJobsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["saved-jobs", page, limit],
    queryFn: () => api.get<SavedItem[]>("/api/saved-jobs", { page, limit }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/saved-jobs/${id}`),
    onSuccess: () => {
      toast({ type: "success", title: "Removed from saved jobs" });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });

  if (query.isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    );
  }

  if (!query.data?.data.length) {
    return (
      <EmptyState
        title="No saved jobs"
        description="Bookmark roles you want to revisit later."
        action={<Button onClick={() => router.push("/jobs")}>Find jobs</Button>}
      />
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Saved jobs</h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {query.data.data.map((item) =>
          item.job ? (
            <div key={item._id} className="relative">
              <JobCard job={item.job} saved onSave={() => removeMutation.mutate(item._id)} />
            </div>
          ) : null
        )}
      </div>
      {query.data.meta ? (
        <Pagination
          meta={query.data.meta}
          onPageChange={(next) => router.push(`/dashboard/saved-jobs?page=${next}&limit=${limit}`)}
          onLimitChange={(next) => router.push(`/dashboard/saved-jobs?page=1&limit=${next}`)}
        />
      ) : null}
    </div>
  );
}

export default function SavedJobsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72" />}>
      <SavedJobsInner />
    </Suspense>
  );
}
