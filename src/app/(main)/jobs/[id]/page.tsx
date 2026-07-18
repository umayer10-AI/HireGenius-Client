"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense } from "react";
import { jobsService } from "@/services/jobs.service";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge, Card, Container, Skeleton } from "@/components/ui/Primitives";
import { formatDate, formatSalary } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

const applySchema = z.object({
  coverLetter: z.string().min(20, "Cover letter should be at least 20 characters"),
  expectedSalary: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === "") return undefined;
      return Number(value);
    }),
});

type ApplyValues = z.output<typeof applySchema>;

function JobDetailInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const showApply = searchParams.get("apply") === "1";

  const jobQuery = useQuery({
    queryKey: ["job", params.id],
    queryFn: () => jobsService.get(params.id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyValues>({
    // Zod transform input/output mismatch with RHF + Zod 4
    resolver: zodResolver(applySchema) as never,
  });

  const applyMutation = useMutation({
    mutationFn: (values: ApplyValues) =>
      api.post("/api/applications", {
        jobId: jobQuery.data?.data._id,
        ...values,
      }),
    onSuccess: () => {
      toast({ type: "success", title: "Application submitted" });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error: Error) => {
      toast({ type: "error", title: "Application failed", description: error.message });
    },
  });

  if (jobQuery.isLoading) {
    return (
      <Container className="py-10">
        <Skeleton className="h-72" />
      </Container>
    );
  }

  if (jobQuery.isError || !jobQuery.data) {
    return (
      <Container className="py-10">
        <Card>
          <h1 className="text-xl font-semibold">Job not found</h1>
          <Link href="/jobs" className="mt-4 inline-block text-primary">
            Back to jobs
          </Link>
        </Card>
      </Container>
    );
  }

  const job = jobQuery.data.data;

  return (
    <Container className="py-10">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <div className="flex flex-wrap gap-2">
            <Badge>{job.jobType}</Badge>
            <Badge tone="secondary">{job.workMode}</Badge>
            <Badge tone="accent">{job.experience}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold">{job.title}</h1>
          <p className="mt-2 text-muted">
            {job.company?.companyName} · {job.location}
          </p>
          <p className="mt-2 font-medium">
            {formatSalary(job.salary.min, job.salary.max, job.currency)}
          </p>
          <p className="mt-1 text-sm text-muted">
            Deadline {formatDate(job.applicationDeadline)}
          </p>

          <div className="prose prose-invert mt-8 max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold">About the role</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{job.description}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Responsibilities</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Requirements</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Benefits</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {job.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="font-semibold">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} tone="muted">
                  {skill}
                </Badge>
              ))}
            </div>
            {user?.role === "candidate" || !user ? (
              <div className="mt-6 space-y-3">
                {!user ? (
                  <Link href="/login">
                    <Button className="w-full">Login to apply</Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      const el = document.getElementById("apply-form");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Apply now
                  </Button>
                )}
              </div>
            ) : null}
          </Card>

          {(showApply || user?.role === "candidate") && user ? (
            <Card id="apply-form">
              <h2 className="font-semibold">Submit application</h2>
              <form
                className="mt-4 space-y-3"
                onSubmit={handleSubmit((values) => applyMutation.mutate(values))}
              >
                <Textarea
                  label="Cover letter"
                  error={errors.coverLetter?.message}
                  {...register("coverLetter")}
                />
                <Input
                  label="Expected salary"
                  type="number"
                  error={errors.expectedSalary?.message}
                  {...register("expectedSalary")}
                />
                <Button type="submit" className="w-full" loading={isSubmitting || applyMutation.isPending}>
                  Submit application
                </Button>
              </form>
            </Card>
          ) : null}
        </div>
      </div>
    </Container>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense fallback={<Container className="py-10"><Skeleton className="h-72" /></Container>}>
      <JobDetailInner />
    </Suspense>
  );
}
