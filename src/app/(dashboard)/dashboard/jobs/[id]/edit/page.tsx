"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Job } from "@/types";
import { JobForm, toJobPayload, type JobFormValues } from "@/components/jobs/JobForm";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, Skeleton } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const jobQuery = useQuery({
    queryKey: ["job", params.id],
    queryFn: () => api.get<Job>(`/api/jobs/${params.id}`),
    enabled: Boolean(params.id),
  });

  const handleUpdate = async (values: JobFormValues) => {
    try {
      await api.patch(`/api/jobs/${params.id}`, toJobPayload(values));
      toast({ type: "success", title: "Job updated successfully" });
      router.push("/dashboard/jobs");
    } catch (error) {
      toast({
        type: "error",
        title: "Could not update job",
        description: error instanceof Error ? error.message : "Try again",
      });
      throw error;
    }
  };

  if (jobQuery.isLoading) {
    return <Skeleton className="h-[480px]" />;
  }

  if (jobQuery.isError || !jobQuery.data?.data) {
    return (
      <EmptyState
        title="Job not found"
        description="This job may have been deleted or you do not have access."
        action={
          <Link href="/dashboard/jobs">
            <Button>Back to jobs</Button>
          </Link>
        }
      />
    );
  }

  const job = jobQuery.data.data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Edit job</h2>
          <p className="mt-1 text-sm text-muted">Update details for {job.title}.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/jobs/${job.slug || job._id}`}>
            <Button variant="outline">View public page</Button>
          </Link>
          <Link href="/dashboard/jobs">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>
      <Card>
        <JobForm mode="edit" initialJob={job} onSubmit={handleUpdate} />
      </Card>
    </div>
  );
}
