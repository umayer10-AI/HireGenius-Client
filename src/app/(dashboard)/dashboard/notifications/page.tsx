"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { NotificationItem } from "@/types";
import { Badge, Card, EmptyState, Skeleton } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<{ items: NotificationItem[]; unreadCount: number }>("/api/notifications", {
        page: 1,
        limit: 50,
      }),
  });

  const markAll = useMutation({
    mutationFn: () => api.patch("/api/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (query.isLoading) return <Skeleton className="h-72" />;

  const items = query.data?.data.items || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted">{query.data?.data.unreadCount || 0} unread</p>
        </div>
        <Button variant="outline" onClick={() => markAll.mutate()} loading={markAll.isPending}>
          Mark all read
        </Button>
      </div>

      {!items.length ? (
        <EmptyState title="You're all caught up" description="New activity will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item._id} className={!item.isRead ? "border-primary/40" : undefined}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {!item.isRead ? <Badge>New</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.message}</p>
                  <p className="mt-2 text-xs text-muted">{formatDate(item.createdAt)}</p>
                </div>
                {item.link ? (
                  <Link href={item.link}>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </Link>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
