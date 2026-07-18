"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BlogPost } from "@/types";
import { Card, Container, Skeleton } from "@/components/ui/Primitives";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const query = useQuery({
    queryKey: ["blog", params.slug],
    queryFn: () => api.get<BlogPost>(`/api/blogs/${params.slug}`),
  });

  if (query.isLoading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-96" />
      </Container>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Container className="py-12">
        <Card>
          <h1 className="text-xl font-semibold">Article not found</h1>
          <Link href="/blog" className="mt-4 inline-block text-primary">
            Back to blog
          </Link>
        </Card>
      </Container>
    );
  }

  const post = query.data.data;

  return (
    <Container className="py-12">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-muted">
          {post.author} · {formatDate(post.createdAt)}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-muted">{post.description}</p>
        <div className="mt-8 whitespace-pre-wrap rounded-[20px] border border-border bg-card p-6 text-sm leading-7 text-muted">
          {post.content}
        </div>
      </article>
    </Container>
  );
}
