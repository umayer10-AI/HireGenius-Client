"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminReportsLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allow={["admin"]}>{children}</RoleGuard>;
}
