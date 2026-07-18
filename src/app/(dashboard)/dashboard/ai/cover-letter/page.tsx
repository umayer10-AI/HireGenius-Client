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
  jobTitle: z.string().min(2),
  companyName: z.string().min(2),
  resume: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  tone: z.enum(["friendly", "professional", "formal"]),
});

type FormValues = z.infer<typeof schema>;

export default function CoverLetterPage() {
  const { toast } = useToast();
  const [letter, setLetter] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tone: "professional" },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-semibold">AI Cover Letter</h2>
        <form
          className="mt-6 space-y-3"
          onSubmit={handleSubmit(async (values) => {
            try {
              const res = await api.post<{ coverLetter: string }>("/api/ai/cover-letter", {
                ...values,
                skills: values.skills
                  ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
                  : [],
              });
              setLetter(res.data.coverLetter);
              toast({ type: "success", title: "Cover letter generated" });
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
          <Input label="Company" {...register("companyName")} />
          <Textarea label="Resume context" {...register("resume")} />
          <Input label="Skills" {...register("skills")} />
          <Textarea label="Experience summary" {...register("experience")} />
          <Select label="Tone" {...register("tone")}>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </Select>
          <Button type="submit" loading={isSubmitting}>
            Generate cover letter
          </Button>
        </form>
      </Card>
      <Card>
        <div className="mb-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!letter}
            onClick={() => navigator.clipboard.writeText(letter)}
          >
            Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!letter}
            onClick={() => {
              const blob = new Blob([letter], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "cover-letter.txt";
              a.click();
            }}
          >
            Download
          </Button>
        </div>
        <Textarea
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          className="min-h-[420px]"
          placeholder="Generated cover letter will appear here and remain editable."
        />
      </Card>
    </div>
  );
}
