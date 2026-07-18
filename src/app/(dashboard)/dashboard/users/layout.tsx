"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminUsersLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allow={["admin"]}>{children}</RoleGuard>;
}
