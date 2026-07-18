"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

const schema = z.object({
  jobTitle: z.string().min(2),
  category: z.string().min(2),
  skills: z.string().min(2),
  experience: z.string().min(1),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function JobDescriptionAIPage() {
  const { toast } = useToast();
  const [output, setOutput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-semibold">AI Job Description Generator</h2>
        <form
          className="mt-6 space-y-3"
          onSubmit={handleSubmit(async (values) => {
            try {
              const res = await api.post<Record<string, unknown>>("/api/ai/job-description", {
                ...values,
                skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
              });
              setOutput(JSON.stringify(res.data, null, 2));
              toast({ type: "success", title: "Job description generated" });
            } catch (error) {
              toast({
                type: "error",
                title: "Generation failed",
                description: error instanceof Error ? error.message : "Try again",
              });
            }
          })}
        >
          <Input label="Job title" {...register("jobTitle")} />
          <Input label="Category" {...register("category")} />
          <Input label="Skills" {...register("skills")} />
          <Input label="Experience" {...register("experience")} />
          <Textarea label="Responsibilities notes" {...register("responsibilities")} />
          <Textarea label="Benefits notes" {...register("benefits")} />
          <Button type="submit" loading={isSubmitting}>
            Generate
          </Button>
        </form>
      </Card>
      <Card>
        <h3 className="mb-3 font-semibold">Generated content</h3>
        <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-[16px] bg-background p-4 text-sm text-muted">
          {output || "AI output will appear here."}
        </pre>
      </Card>
    </div>
  );
}
