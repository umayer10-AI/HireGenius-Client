"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/providers/AuthProvider";
import type { UserRole } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, Spinner } from "@/components/ui/Primitives";

interface RoleGuardProps {
  allow: UserRole[];
  children: ReactNode;
  fallbackHref?: string;
}

export function RoleGuard({ allow, children, fallbackHref = "/dashboard" }: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || !allow.includes(user.role)) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="text-xl font-semibold">Access restricted</h2>
        <p className="mt-2 text-sm text-muted">
          This area is only available for {allow.join(" / ")} accounts.
          {user ? ` Your current role is ${user.role}.` : ""}
        </p>
        <Link href={fallbackHref} className="mt-6 inline-block">
          <Button>Back to dashboard</Button>
        </Link>
      </Card>
    );
  }

  return <>{children}</>;
}
