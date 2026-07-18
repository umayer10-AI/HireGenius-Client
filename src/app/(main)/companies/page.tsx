"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Company } from "@/types";
import { Badge, Card, Container, EmptyState, SectionTitle, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CompaniesInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);

  const query = useQuery({
    queryKey: ["companies", page, limit],
    queryFn: () => api.get<Company[]>("/api/companies", { page, limit }),
  });

  return (
    <Container className="py-10">
      <SectionTitle
        eyebrow="Companies"
        title="Explore hiring teams"
        description="Discover verified companies actively hiring on HireGenius AI."
      />
      {query.isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : null}
      {query.isError ? (
        <EmptyState
          title="Could not load companies"
          description={query.error instanceof Error ? query.error.message : "Try again"}
          action={<Button onClick={() => query.refetch()}>Retry</Button>}
        />
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {query.data?.data.map((company) => (
          <Card key={company._id} className="h-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{company.companyName}</h3>
                <p className="text-sm text-muted">{company.industry}</p>
              </div>
              {company.verified ? <Badge tone="accent">Verified</Badge> : null}
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-muted">{company.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-muted">
              <span>{company.location}</span>
              <span>{company.openJobs || 0} open roles</span>
            </div>
            <Link href={`/companies?highlight=${company._id}`} className="mt-4 inline-block">
              <Button variant="outline">View company</Button>
            </Link>
          </Card>
        ))}
      </div>
      {query.data?.meta ? (
        <Pagination
          meta={query.data.meta}
          onPageChange={(next) => router.push(`/companies?page=${next}&limit=${limit}`)}
          onLimitChange={(next) => router.push(`/companies?page=1&limit=${next}`)}
        />
      ) : null}
    </Container>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<Container className="py-10"><Skeleton className="h-72" /></Container>}>
      <CompaniesInner />
    </Suspense>
  );
}
