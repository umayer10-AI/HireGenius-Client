"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Company } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card, EmptyState } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";
import { COMPANY_SIZES } from "@/constants/company";

const schema = z.object({
  companyName: z.string().min(2),
  industry: z.string().min(2),
  companySize: z.string().min(1),
  description: z.string().min(20),
  location: z.string().min(2),
  website: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CompanyDashboardPage() {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["my-companies"],
    queryFn: () => api.get<Company[]>("/api/companies/mine"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { companySize: "11-50" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Company profile</h2>
      {query.data?.data.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {query.data.data.map((company) => (
            <Card key={company._id}>
              <h3 className="text-lg font-semibold">{company.companyName}</h3>
              <p className="mt-1 text-sm text-muted">
                {company.industry} · {company.location}
              </p>
              <p className="mt-3 line-clamp-4 text-sm text-muted">{company.description}</p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No company yet" description="Create your company profile to start posting jobs." />
      )}

      <Card>
        <h3 className="font-semibold">Create company</h3>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            try {
              await api.post("/api/companies", values);
              toast({ type: "success", title: "Company created" });
              reset();
              await query.refetch();
            } catch (error) {
              toast({
                type: "error",
                title: "Could not create company",
                description: error instanceof Error ? error.message : "Try again",
              });
            }
          })}
        >
          <Input label="Company name" error={errors.companyName?.message} {...register("companyName")} />
          <Input label="Industry" error={errors.industry?.message} {...register("industry")} />
          <Select label="Company size" {...register("companySize")}>
            {COMPANY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <Input label="Location" error={errors.location?.message} {...register("location")} />
          <Input label="Website" {...register("website")} />
          <Input label="Email" {...register("email")} />
          <Input label="Phone" {...register("phone")} />
          <Textarea
            label="Description"
            className="md:col-span-2"
            error={errors.description?.message}
            {...register("description")}
          />
          <Button type="submit" loading={isSubmitting} className="md:col-span-2 md:w-fit">
            Create company
          </Button>
        </form>
      </Card>
    </div>
  );
}
