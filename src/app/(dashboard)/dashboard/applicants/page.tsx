"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@/types";
import { Badge, EmptyState, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { Select } from "@/components/ui/Input";

export default function ApplicantsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["applicants"],
    queryFn: () => api.get<Application[]>("/api/applications", { page: 1, limit: 50 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Application["status"] }) =>
      api.patch(`/api/applications/${id}`, { status }),
    onSuccess: () => {
      toast({ type: "success", title: "Status updated" });
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });

  if (query.isLoading) return <Skeleton className="h-72" />;
  if (!query.data?.data.length) {
    return <EmptyState title="No applicants yet" description="Applications for your jobs will show up here." />;
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Applicants</h2>
      <div className="overflow-x-auto rounded-[20px] border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border text-muted">
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {query.data.data.map((app) => (
              <tr key={app._id} className="border-b border-border/70">
                <td className="px-4 py-3">
                  <p className="font-medium">{app.candidate?.name}</p>
                  <p className="text-xs text-muted">{app.candidate?.email}</p>
                </td>
                <td className="px-4 py-3 text-muted">{app.job?.title}</td>
                <td className="px-4 py-3 text-muted">{formatDate(app.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge>{app.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Select
                      className="w-44"
                      value={app.status}
                      onChange={(e) =>
                        updateMutation.mutate({
                          id: app._id,
                          status: e.target.value as Application["status"],
                        })
                      }
                    >
                      {[
                        "Applied",
                        "Reviewed",
                        "Shortlisted",
                        "Interview Scheduled",
                        "Accepted",
                        "Rejected",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                    {app.resume ? (
                      <a href={app.resume} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline">
                          Resume
                        </Button>
                      </a>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
