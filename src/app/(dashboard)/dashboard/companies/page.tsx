"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Company } from "@/types";
import { Card, Skeleton } from "@/components/ui/Primitives";

export default function AdminCompaniesPage() {
  const query = useQuery({
    queryKey: ["admin-companies"],
    queryFn: () => api.get<Company[]>("/api/companies", { page: 1, limit: 50 }),
  });

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Companies</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {query.data?.data.map((company) => (
          <Card key={company._id}>
            <h3 className="font-semibold">{company.companyName}</h3>
            <p className="mt-1 text-sm text-muted">{company.industry}</p>
            <p className="mt-3 text-sm text-muted">
              {company.openJobs || 0} open jobs · Rating {company.rating}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
