"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BlogPost } from "@/types";
import { Card, Container, SectionTitle, Skeleton } from "@/components/ui/Primitives";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  const query = useQuery({
    queryKey: ["blogs"],
    queryFn: () => api.get<BlogPost[]>("/api/blogs", { page: 1, limit: 12 }),
  });

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Blog"
        title="Career intelligence and hiring insights"
        description="Practical guidance for candidates and recruiting teams."
      />
      {query.isLoading ? (
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : query.isError ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <h3 className="text-lg font-semibold">Could not load blog posts</h3>
          <p className="mt-2 max-w-md text-sm text-muted">
            {query.error instanceof Error ? query.error.message : "The server is currently unavailable. Please try again later."}
          </p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="mt-6 inline-flex items-center rounded-[14px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {query.data?.data.map((post) => (
            <Card key={post._id} className="h-full">
              <div className="mb-4 h-36 rounded-[16px] bg-gradient-to-br from-primary/25 via-secondary/15 to-accent/20" />
              <p className="text-xs text-muted">
                {post.author} · {formatDate(post.createdAt)}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-primary">
                Read article →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
