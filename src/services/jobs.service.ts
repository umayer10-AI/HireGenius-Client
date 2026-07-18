import { api } from "@/lib/api";
import type { BlogPost, Job, JobFilters, PaginationMeta } from "@/types";

export const jobsService = {
  list: (filters: JobFilters = {}) =>
    api.get<Job[]>("/api/jobs", filters as Record<string, string | number | boolean | undefined>),
  featured: () => api.get<Job[]>("/api/jobs/featured"),
  categories: () => api.get<Array<{ name: string; count: number }>>("/api/jobs/categories"),
  get: (id: string) => api.get<Job>(`/api/jobs/${id}`),
  platformStats: () =>
    api.get<{
      jobs: number;
      companies: number;
      candidates: number;
      recruiters: number;
      applications: number;
    }>("/api/stats"),
};

export const companiesService = {
  list: (query: Record<string, string | number | undefined> = {}) =>
    api.get("/api/companies", query),
  get: (id: string) => api.get(`/api/companies/${id}`),
};

export const blogsService = {
  list: (query: Record<string, string | number | undefined> = {}) =>
    api.get<BlogPost[]>("/api/blogs", query),
  getBySlug: (slug: string) => api.get<BlogPost>(`/api/blogs/${slug}`),
};

export type { PaginationMeta };
