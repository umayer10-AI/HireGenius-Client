"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["candidate", "recruiter"]),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const { refresh } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "candidate" },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/dashboard",
    });

    if (result.error) {
      toast({ type: "error", title: "Registration failed", description: result.error.message });
      return;
    }

    try {
      await api.patch("/api/me/role", { role: values.role });
    } catch {
      toast({
        type: "error",
        title: "Role not saved",
        description: "You can switch Candidate / Recruiter later from Settings.",
      });
    }

    await refresh();
    toast({ type: "success", title: "Account created" });
    window.location.assign("/dashboard");
  };

  return (
    <Card className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Join as a candidate or recruiter in minutes.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full name" error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Select label="I am a" error={errors.role?.message} {...register("role")}>
          <option value="candidate">Candidate — browse & apply to jobs</option>
          <option value="recruiter">Recruiter — post & manage jobs</option>
        </Select>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
