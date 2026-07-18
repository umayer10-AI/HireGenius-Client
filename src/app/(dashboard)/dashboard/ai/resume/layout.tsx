"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AIResumeLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allow={["candidate", "admin"]}>{children}</RoleGuard>;
}
