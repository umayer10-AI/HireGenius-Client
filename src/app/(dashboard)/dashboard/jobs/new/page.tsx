"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { JobForm, toJobPayload, type JobFormValues } from "@/components/jobs/JobForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

export default function PostJobPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleCreate = async (values: JobFormValues) => {
    try {
      await api.post("/api/jobs", toJobPayload(values));
      toast({ type: "success", title: "Job created successfully" });
      router.push("/dashboard/jobs");
    } catch (error) {
      toast({
        type: "error",
        title: "Could not create job",
        description: error instanceof Error ? error.message : "Try again",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Create job</h2>
          <p className="mt-1 text-sm text-muted">Publish a new opening for your company.</p>
        </div>
        <Link href="/dashboard/jobs">
          <Button variant="outline">Back to jobs</Button>
        </Link>
      </div>
      <Card>
        <JobForm mode="create" onSubmit={handleCreate} />
      </Card>
    </div>
  );
}
