"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Eye } from "lucide-react";
import { api } from "@/lib/api";
import type { Job, JobStatus } from "@/types";
import { Badge, EmptyState, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { formatDate, formatSalary } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

function ManageJobsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  const query = useQuery({
    queryKey: ["manage-jobs", page, limit, search, status],
    queryFn: () =>
      api.get<Job[]>("/api/jobs/mine", {
        page,
        limit,
        search,
        status,
        sort: "newest",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/jobs/${id}`),
    onSuccess: () => {
      toast({ type: "success", title: "Job deleted" });
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["manage-jobs"] });
    },
    onError: (error: Error) => {
      toast({ type: "error", title: "Delete failed", description: error.message });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      api.patch(`/api/jobs/${id}`, { status }),
    onSuccess: () => {
      toast({ type: "success", title: "Status updated" });
      queryClient.invalidateQueries({ queryKey: ["manage-jobs"] });
    },
    onError: (error: Error) => {
      toast({ type: "error", title: "Update failed", description: error.message });
    },
  });

  const updateParams = (patch: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/dashboard/jobs?${params.toString()}`);
  };

  if (query.isLoading) return <Skeleton className="h-72" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Manage jobs</h2>
          <p className="mt-1 text-sm text-muted">
            Create, edit, update status, and delete your job postings.
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="h-4 w-4" />
            Create job
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 rounded-[20px] border border-border bg-card p-4 md:grid-cols-[1fr_200px]">
        <Input
          label="Search"
          placeholder="Search by title..."
          defaultValue={search}
          onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
          <option value="expired">Expired</option>
        </Select>
      </div>

      {!query.data?.data.length ? (
        <EmptyState
          title="No jobs found"
          description="Create your first job posting to start receiving applications."
          action={
            <Link href="/dashboard/jobs/new">
              <Button>Create job</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-[20px] border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-card">
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((job) => (
                <tr key={job._id} className="border-b border-border/70 hover:bg-border/10">
                  <td className="px-4 py-3 font-medium">{job.title}</td>
                  <td className="px-4 py-3 text-muted">{job.category}</td>
                  <td className="px-4 py-3 text-muted">
                    {formatSalary(job.salary.min, job.salary.max, job.currency)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(job.applicationDeadline)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <Badge>{job.status}</Badge>
                      <Select
                        aria-label={`Update status for ${job.title}`}
                        className="w-32"
                        value={job.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: job._id,
                            status: e.target.value as JobStatus,
                          })
                        }
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="expired">Expired</option>
                      </Select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/jobs/${job.slug || job._id}`}>
                        <Button size="sm" variant="outline" aria-label="View job">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/jobs/${job._id}/edit`}>
                        <Button size="sm" variant="secondary" aria-label="Edit job">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      {deletingId === job._id ? (
                        <>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={deleteMutation.isPending}
                            onClick={() => deleteMutation.mutate(job._id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          aria-label="Delete job"
                          onClick={() => setDeletingId(job._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query.data?.meta ? (
        <Pagination
          meta={query.data.meta}
          onPageChange={(next) => updateParams({ page: next })}
          onLimitChange={(next) => updateParams({ limit: next, page: 1 })}
        />
      ) : null}
    </div>
  );
}

export default function ManageJobsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72" />}>
      <ManageJobsInner />
    </Suspense>
  );
}
