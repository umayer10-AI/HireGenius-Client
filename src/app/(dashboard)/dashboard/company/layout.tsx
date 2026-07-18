"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allow={["recruiter", "admin"]}>{children}</RoleGuard>;
}
