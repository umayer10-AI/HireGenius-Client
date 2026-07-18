"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CandidateApplicationsLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allow={["candidate", "admin"]}>{children}</RoleGuard>;
}
