"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { jobsService } from "@/services/jobs.service";
import { JobCard } from "@/components/jobs/JobCard";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Container, EmptyState, SectionTitle, Skeleton } from "@/components/ui/Primitives";
import { EXPERIENCE_LEVELS, JOB_CATEGORIES, JOB_TYPES, SORT_OPTIONS, WORK_MODES } from "@/constants";
import { api } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";
import { Suspense } from "react";

function JobsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 12),
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      category: searchParams.get("category") || "",
      experience: searchParams.get("experience") || "",
      jobType: searchParams.get("jobType") || "",
      workMode: searchParams.get("workMode") || "",
      sort: searchParams.get("sort") || "newest",
      minSalary: searchParams.get("minSalary") || "",
      maxSalary: searchParams.get("maxSalary") || "",
    }),
    [searchParams]
  );

  const query = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () =>
      jobsService.list({
        ...filters,
        minSalary: filters.minSalary ? Number(filters.minSalary) : undefined,
        maxSalary: filters.maxSalary ? Number(filters.maxSalary) : undefined,
      }),
  });

  const updateParams = (patch: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const saveJob = async (jobId: string) => {
    try {
      await api.post("/api/saved-jobs", { jobId });
      toast({ type: "success", title: "Job saved" });
    } catch (error) {
      toast({
        type: "error",
        title: "Could not save job",
        description: error instanceof Error ? error.message : "Try again",
      });
    }
  };


  return (
    <Container className="py-10">
      <SectionTitle
        eyebrow="Job board"
        title="Find your next opportunity"
        description="Search, filter, and paginate through live openings without full page reloads."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[20px] border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold">Filters</h3>
          <div className="space-y-3">
            <Input
              label="Keyword"
              defaultValue={filters.search}
              onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
            />
            <Input
              label="Location"
              defaultValue={filters.location}
              onChange={(e) => updateParams({ location: e.target.value, page: 1 })}
            />
            <Select
              label="Category"
              value={filters.category}
              onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select
              label="Experience"
              value={filters.experience}
              onChange={(e) => updateParams({ experience: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              {EXPERIENCE_LEVELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select
              label="Job type"
              value={filters.jobType}
              onChange={(e) => updateParams({ jobType: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              {JOB_TYPES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
            <Select
              label="Work mode"
              value={filters.workMode}
              onChange={(e) => updateParams({ workMode: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              {WORK_MODES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
            <Input
              label="Min salary"
              type="number"
              defaultValue={filters.minSalary}
              onChange={(e) => updateParams({ minSalary: e.target.value, page: 1 })}
            />
            <Input
              label="Max salary"
              type="number"
              defaultValue={filters.maxSalary}
              onChange={(e) => updateParams({ maxSalary: e.target.value, page: 1 })}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/jobs")}
            >
              Reset filters
            </Button>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {query.data?.meta?.total ?? 0} roles found
            </p>
            <Select
              className="sm:w-56"
              value={filters.sort}
              onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
              aria-label="Sort jobs"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {query.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : null}

          {query.isError ? (
            <EmptyState
              title="Could not load jobs"
              description={query.error instanceof Error ? query.error.message : "Try again"}
              action={
                <Button onClick={() => query.refetch()}>Retry</Button>
              }
            />
          ) : null}

          {!query.isLoading && !query.isError && (query.data?.data.length || 0) === 0 ? (
            <EmptyState
              title="No jobs found"
              description="Try clearing filters or searching a different keyword."
              action={<Button onClick={() => router.push("/jobs")}>Clear filters</Button>}
            />
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {query.data?.data.map((job) => (
              <JobCard key={job._id} job={job} onSave={saveJob} />
            ))}
          </div>

          {query.data?.meta ? (
            <Pagination
              meta={query.data.meta}
              onPageChange={(page) => updateParams({ page })}
              onLimitChange={(limit) => updateParams({ limit, page: 1 })}
            />
          ) : null}
        </div>
      </div>
    </Container>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<Container className="py-10"><Skeleton className="h-96" /></Container>}>
      <JobsPageInner />
    </Suspense>
  );
}
