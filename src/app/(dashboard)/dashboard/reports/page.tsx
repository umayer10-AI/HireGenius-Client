"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application, Job, User } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

function toCsv(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
  ];
  return lines.join("\n");
}

export default function ReportsPage() {
  const { toast } = useToast();
  const users = useQuery({ queryKey: ["report-users"], queryFn: () => api.get<User[]>("/api/users", { page: 1, limit: 100 }) });
  const jobs = useQuery({ queryKey: ["report-jobs"], queryFn: () => api.get<Job[]>("/api/jobs", { page: 1, limit: 100 }) });
  const applications = useQuery({
    queryKey: ["report-applications"],
    queryFn: () => api.get<Application[]>("/api/applications", { page: 1, limit: 100 }),
  });

  const download = (filename: string, rows: Array<Record<string, string | number>>) => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    toast({ type: "success", title: `${filename} downloaded` });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Reports</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="font-semibold">Users CSV</h3>
          <p className="mt-2 text-sm text-muted">{users.data?.meta?.total ?? 0} records</p>
          <Button
            className="mt-4"
            onClick={() =>
              download(
                "users.csv",
                (users.data?.data || []).map((u) => ({
                  name: u.name,
                  email: u.email,
                  role: u.role,
                }))
              )
            }
          >
            Export CSV
          </Button>
        </Card>
        <Card>
          <h3 className="font-semibold">Jobs CSV</h3>
          <p className="mt-2 text-sm text-muted">{jobs.data?.meta?.total ?? 0} records</p>
          <Button
            className="mt-4"
            onClick={() =>
              download(
                "jobs.csv",
                (jobs.data?.data || []).map((j) => ({
                  title: j.title,
                  category: j.category,
                  location: j.location,
                  status: j.status,
                }))
              )
            }
          >
            Export CSV
          </Button>
        </Card>
        <Card>
          <h3 className="font-semibold">Applications CSV</h3>
          <p className="mt-2 text-sm text-muted">{applications.data?.meta?.total ?? 0} records</p>
          <Button
            className="mt-4"
            onClick={() =>
              download(
                "applications.csv",
                (applications.data?.data || []).map((a) => ({
                  candidate: a.candidate?.name || "",
                  job: a.job?.title || "",
                  status: a.status,
                }))
              )
            }
          >
            Export CSV
          </Button>
        </Card>
      </div>
    </div>
  );
}
