"use client";

import { useAuth } from "@/providers/AuthProvider";
import { calculateLocalCompletion } from "@/lib/profile";
import { Badge, Card } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  const completion = calculateLocalCompletion(user);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Card>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-xl font-semibold text-primary">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-muted">{user.email}</p>
        <Badge className="mt-3">{user.role}</Badge>
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Profile completion</span>
            <span className="font-medium">{completion.percentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-border">
            <div
              className="h-2 rounded-full gradient-primary"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>
          {completion.missing.length ? (
            <p className="mt-3 text-xs text-muted">Missing: {completion.missing.join(", ")}</p>
          ) : null}
        </div>
        <Link href="/dashboard/settings" className="mt-6 block">
          <Button className="w-full">Edit profile</Button>
        </Link>
      </Card>

      <div className="space-y-4">
        <Card>
          <h3 className="font-semibold">About</h3>
          <p className="mt-2 text-sm text-muted">{user.bio || "Add a short bio in settings."}</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.skills?.length ? (
              user.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)
            ) : (
              <p className="text-sm text-muted">No skills added yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Links</h3>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <p>Location: {user.location || "—"}</p>
            <p>Portfolio: {user.portfolio || "—"}</p>
            <p>GitHub: {user.github || "—"}</p>
            <p>LinkedIn: {user.linkedin || "—"}</p>
            <p>Resume: {user.resume ? "Uploaded" : "Missing"}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
