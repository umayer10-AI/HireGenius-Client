"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/types";
import { Badge, Skeleton } from "@/components/ui/Primitives";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UsersInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  const query = useQuery({
    queryKey: ["admin-users", page, limit],
    queryFn: () => api.get<User[]>("/api/users", { page, limit }),
  });

  if (query.isLoading) return <Skeleton className="h-72" />;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Manage users</h2>
      <div className="overflow-x-auto rounded-[20px] border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.data.map((user) => (
              <tr key={user._id} className="border-b border-border/70">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge>{user.role}</Badge>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {query.data?.meta ? (
        <Pagination
          meta={query.data.meta}
          onPageChange={(next) => router.push(`/dashboard/users?page=${next}&limit=${limit}`)}
          onLimitChange={(next) => router.push(`/dashboard/users?page=1&limit=${next}`)}
        />
      ) : null}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72" />}>
      <UsersInner />
    </Suspense>
  );
}
