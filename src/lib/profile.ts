import type { User } from "@/types";

export function calculateLocalCompletion(user: User): { percentage: number; missing: string[] } {
  const checks: Array<{ label: string; ok: boolean }> = [
    { label: "Name", ok: Boolean(user.name) },
    { label: "Email", ok: Boolean(user.email) },
    { label: "Phone", ok: Boolean(user.phone) },
    { label: "Bio", ok: Boolean(user.bio) },
    { label: "Profile Photo", ok: Boolean(user.image) },
    { label: "Skills", ok: Boolean(user.skills?.length) },
    { label: "Experience", ok: Boolean(user.experience?.length) },
    { label: "Education", ok: Boolean(user.education?.length) },
    { label: "Resume", ok: Boolean(user.resume) },
    { label: "Portfolio", ok: Boolean(user.portfolio) },
    { label: "GitHub", ok: Boolean(user.github) },
    { label: "LinkedIn", ok: Boolean(user.linkedin) },
    { label: "Location", ok: Boolean(user.location) },
  ];
  const completed = checks.filter((c) => c.ok).length;
  return {
    percentage: Math.round((completed / checks.length) * 100),
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}
