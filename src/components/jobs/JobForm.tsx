"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Company, Job } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EXPERIENCE_LEVELS, JOB_CATEGORIES, JOB_TYPES, WORK_MODES } from "@/constants";

export const jobFormSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  title: z.string().min(3, "Title is required"),
  shortDescription: z.string().min(20, "Short description must be at least 20 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(3, "Add at least one requirement"),
  responsibilities: z.string().min(3, "Add at least one responsibility"),
  benefits: z.string().optional(),
  skills: z.string().min(2, "Add at least one skill"),
  salaryMin: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  salaryMax: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  currency: z.string().default("USD"),
  experience: z.string().min(1),
  category: z.string().min(1),
  jobType: z.enum(["full-time", "part-time", "contract", "internship", "freelance"]),
  workMode: z.enum(["remote", "onsite", "hybrid"]),
  location: z.string().min(1),
  vacancies: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  applicationDeadline: z.string().min(1),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "active", "closed", "expired"]).default("active"),
});

export type JobFormValues = z.output<typeof jobFormSchema>;

export function toJobPayload(values: JobFormValues) {
  return {
    companyId: values.companyId,
    title: values.title,
    shortDescription: values.shortDescription,
    description: values.description,
    requirements: values.requirements
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean),
    responsibilities: values.responsibilities
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean),
    benefits: values.benefits
      ? values.benefits
          .split("\n")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [],
    skills: values.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean),
    salary: { min: values.salaryMin, max: values.salaryMax },
    currency: values.currency || "USD",
    experience: values.experience,
    category: values.category,
    jobType: values.jobType,
    workMode: values.workMode,
    location: values.location,
    vacancies: values.vacancies,
    applicationDeadline: values.applicationDeadline,
    featured: Boolean(values.featured),
    status: values.status,
  };
}

function formatDeadline(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function jobToFormValues(job: Job): Partial<JobFormValues> {
  return {
    companyId: String(job.companyId),
    title: job.title,
    shortDescription: job.shortDescription,
    description: job.description,
    requirements: job.requirements?.join("\n") || "",
    responsibilities: job.responsibilities?.join("\n") || "",
    benefits: job.benefits?.join("\n") || "",
    skills: job.skills?.join(", ") || "",
    salaryMin: job.salary.min,
    salaryMax: job.salary.max,
    currency: job.currency || "USD",
    experience: job.experience,
    category: job.category,
    jobType: job.jobType,
    workMode: job.workMode,
    location: job.location,
    vacancies: job.vacancies,
    applicationDeadline: formatDeadline(job.applicationDeadline),
    featured: job.featured,
    status: job.status,
  };
}

interface JobFormProps {
  mode: "create" | "edit";
  initialJob?: Job;
  submitting?: boolean;
  onSubmit: (values: JobFormValues) => Promise<void>;
}

export function JobForm({ mode, initialJob, submitting, onSubmit }: JobFormProps) {
  const companies = useQuery({
    queryKey: ["my-companies"],
    queryFn: () => api.get<Company[]>("/api/companies/mine"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema) as never,
    defaultValues: {
      currency: "USD",
      jobType: "full-time",
      workMode: "remote",
      vacancies: 1,
      experience: "Mid Level",
      category: "Software Engineering",
      status: "active",
      featured: false,
    },
  });

  useEffect(() => {
    if (initialJob) {
      reset(jobToFormValues(initialJob) as JobFormValues);
    }
  }, [initialJob, reset]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <Select label="Company" error={errors.companyId?.message} {...register("companyId")}>
        <option value="">Select company</option>
        {companies.data?.data.map((company) => (
          <option key={company._id} value={company._id}>
            {company.companyName}
          </option>
        ))}
      </Select>

      <Input label="Title" error={errors.title?.message} {...register("title")} />

      <Textarea
        label="Short description"
        className="md:col-span-2"
        error={errors.shortDescription?.message}
        {...register("shortDescription")}
      />

      <Textarea
        label="Full description"
        className="md:col-span-2"
        error={errors.description?.message}
        {...register("description")}
      />

      <Textarea
        label="Requirements (one per line)"
        error={errors.requirements?.message}
        {...register("requirements")}
      />

      <Textarea
        label="Responsibilities (one per line)"
        error={errors.responsibilities?.message}
        {...register("responsibilities")}
      />

      <Textarea label="Benefits (one per line)" {...register("benefits")} />
      <Input label="Skills (comma separated)" error={errors.skills?.message} {...register("skills")} />

      <Input label="Salary min" type="number" {...register("salaryMin")} />
      <Input label="Salary max" type="number" {...register("salaryMax")} />

      <Select label="Experience" {...register("experience")}>
        {EXPERIENCE_LEVELS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>

      <Select label="Category" {...register("category")}>
        {JOB_CATEGORIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>

      <Select label="Job type" {...register("jobType")}>
        {JOB_TYPES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>

      <Select label="Work mode" {...register("workMode")}>
        {WORK_MODES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>

      <Input label="Location" {...register("location")} />
      <Input label="Vacancies" type="number" {...register("vacancies")} />
      <Input label="Deadline" type="date" {...register("applicationDeadline")} />

      <Select label="Status" {...register("status")}>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="closed">Closed</option>
        <option value="expired">Expired</option>
      </Select>

      <label className="flex items-center gap-2 text-sm md:col-span-2">
        <input type="checkbox" {...register("featured")} />
        Feature this job
      </label>

      <Button type="submit" loading={isSubmitting || submitting} className="md:col-span-2 md:w-fit">
        {mode === "create" ? "Publish job" : "Update job"}
      </Button>
    </form>
  );
}
