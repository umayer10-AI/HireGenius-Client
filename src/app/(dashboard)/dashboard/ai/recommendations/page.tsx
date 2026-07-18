"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge, Card, EmptyState, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Recommendation {
  jobId: string;
  score: number;
  reasons: string[];
  job?: {
    _id: string;
    title: string;
    slug: string;
    location: string;
    shortDescription: string;
  } | null;
  company?: { companyName?: string } | null;
}

export default function RecommendationsPage() {
  const query = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: () =>
      api.post<{ recommendations: Recommendation[] }>("/api/ai/job-recommendation", {
        limit: 6,
      }),
  });

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <EmptyState
        title="Could not generate recommendations"
        description={query.error instanceof Error ? query.error.message : "Try again"}
        action={<Button onClick={() => query.refetch()}>Retry</Button>}
      />
    );
  }

  const items = query.data?.data.recommendations || [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Job Recommendations</h2>
      {!items.length ? (
        <EmptyState title="No matches yet" description="Complete your profile and skills for better recommendations." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.jobId}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{item.job?.title || "Role"}</h3>
                  <p className="text-sm text-muted">
                    {item.company?.companyName || "Company"} · {item.job?.location}
                  </p>
                </div>
                <Badge tone="accent">{item.score}% match</Badge>
              </div>
              <p className="mt-3 text-sm text-muted">{item.job?.shortDescription}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {item.reasons?.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              {item.job ? (
                <Link href={`/jobs/${item.job.slug || item.job._id}`} className="mt-4 inline-block">
                  <Button size="sm">View role</Button>
                </Link>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
