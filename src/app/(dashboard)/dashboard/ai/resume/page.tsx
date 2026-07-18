"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

const schema = z.object({
  name: z.string().min(2),
  education: z.string().min(5),
  experience: z.string().min(5),
  projects: z.string().optional(),
  skills: z.string().min(2),
  achievements: z.string().optional(),
  targetJob: z.string().min(2),
  preferredCountry: z.string().optional(),
  preferredIndustry: z.string().optional(),
  version: z.enum(["short", "long", "standard"]),
});

type FormValues = z.infer<typeof schema>;

export default function AIResumePage() {
  const { toast } = useToast();
  const [resume, setResume] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { version: "standard" },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-semibold">AI Resume Builder</h2>
        <p className="mt-2 text-sm text-muted">Generate an ATS-friendly resume tailored to your target role.</p>
        <form
          className="mt-6 space-y-3"
          onSubmit={handleSubmit(async (values) => {
            try {
              const res = await api.post<{ resume: string }>("/api/ai/resume", {
                ...values,
                skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
              });
              setResume(res.data.resume);
              toast({ type: "success", title: "Resume generated" });
            } catch (error) {
              toast({
                type: "error",
                title: "Generation failed",
                description: error instanceof Error ? error.message : "Try again",
              });
            }
          })}
        >
          <Input label="Name" {...register("name")} />
          <Input label="Target job" {...register("targetJob")} />
          <Textarea label="Education" {...register("education")} />
          <Textarea label="Experience" {...register("experience")} />
          <Textarea label="Projects" {...register("projects")} />
          <Input label="Skills (comma separated)" {...register("skills")} />
          <Textarea label="Achievements" {...register("achievements")} />
          <Input label="Preferred country" {...register("preferredCountry")} />
          <Input label="Preferred industry" {...register("preferredIndustry")} />
          <Select label="Version" {...register("version")}>
            <option value="standard">Standard</option>
            <option value="short">Short</option>
            <option value="long">Long</option>
          </Select>
          <Button type="submit" loading={isSubmitting}>
            Generate resume
          </Button>
        </form>
      </Card>
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-semibold">Output</h3>
          {resume ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const blob = new Blob([resume], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "hiregenius-resume.txt";
                a.click();
              }}
            >
              Download TXT
            </Button>
          ) : null}
        </div>
        <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-[16px] bg-background p-4 text-sm text-muted">
          {resume || "Your generated resume will appear here."}
        </pre>
      </Card>
    </div>
  );
}
