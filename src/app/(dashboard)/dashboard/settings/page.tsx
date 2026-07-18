"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge, Card } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";
import { useTheme } from "next-themes";
import type { UserRole } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  portfolio: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  skills: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [roleLoading, setRoleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: user?.name || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      location: user?.location || "",
      portfolio: user?.portfolio || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      skills: user?.skills?.join(", ") || "",
    },
  });

  if (!user) return null;

  const switchRole = async (role: Extract<UserRole, "candidate" | "recruiter">) => {
    if (user.role === role || user.role === "admin") return;
    setRoleLoading(true);
    try {
      await api.patch("/api/me/role", { role });
      toast({
        type: "success",
        title: "Role updated",
        description: role === "recruiter" ? "You can now post and manage jobs." : "You can now apply to jobs.",
      });
      window.location.assign("/dashboard");
      return;
    } catch (error) {
      toast({
        type: "error",
        title: "Could not change role",
        description: error instanceof Error ? error.message : "Try again",
      });
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>

      {user.role !== "admin" ? (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Account type</h3>
              <p className="mt-1 text-sm text-muted">
                Recruiters can create, edit, and delete jobs. Candidates browse and apply.
              </p>
            </div>
            <Badge>{user.role}</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={user.role === "candidate" ? "primary" : "outline"}
              loading={roleLoading && user.role !== "candidate"}
              disabled={roleLoading}
              onClick={() => switchRole("candidate")}
            >
              Candidate
            </Button>
            <Button
              variant={user.role === "recruiter" ? "primary" : "outline"}
              loading={roleLoading && user.role !== "recruiter"}
              disabled={roleLoading}
              onClick={() => switchRole("recruiter")}
            >
              Recruiter
            </Button>
          </div>
        </Card>
      ) : null}

      <Card>
        <h3 className="font-semibold">Account</h3>
        <form
          className="mt-4 grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            try {
              await api.patch(`/api/users/${user._id}`, {
                ...values,
                skills: values.skills
                  ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
                  : [],
              });
              await refresh();
              toast({ type: "success", title: "Profile updated" });
            } catch (error) {
              toast({
                type: "error",
                title: "Update failed",
                description: error instanceof Error ? error.message : "Try again",
              });
            }
          })}
        >
          <Input label="Name" {...register("name")} />
          <Input label="Phone" {...register("phone")} />
          <Input label="Location" {...register("location")} />
          <Input label="Skills (comma separated)" {...register("skills")} />
          <Input label="Portfolio" {...register("portfolio")} />
          <Input label="GitHub" {...register("github")} />
          <Input label="LinkedIn" {...register("linkedin")} />
          <Textarea label="Bio" className="md:col-span-2" {...register("bio")} />
          <Button type="submit" loading={isSubmitting} className="md:col-span-2 md:w-fit">
            Save changes
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="font-semibold">Appearance</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["dark", "Dark"],
            ["light", "Light"],
            ["system", "System"],
          ].map(([value, label]) => (
            <Button
              key={value}
              variant={theme === value ? "primary" : "outline"}
              onClick={() => setTheme(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-danger">Danger zone</h3>
        <p className="mt-2 text-sm text-muted">
          Account deletion permanently removes your HireGenius profile and related data.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={async () => {
            if (!confirm("Delete your account permanently?")) return;
            await api.delete(`/api/users/${user._id}`);
            toast({ type: "success", title: "Account deleted" });
            window.location.href = "/";
          }}
        >
          Delete account
        </Button>
      </Card>
    </div>
  );
}
