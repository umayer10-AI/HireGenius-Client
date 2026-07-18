"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function RecommendationsLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allow={["candidate", "admin"]}>{children}</RoleGuard>;
}
