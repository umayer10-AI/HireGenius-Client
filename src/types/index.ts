export type UserRole = "admin" | "recruiter" | "candidate";

export type JobType = "full-time" | "part-time" | "contract" | "internship" | "freelance";
export type WorkMode = "remote" | "onsite" | "hybrid";
export type JobStatus = "draft" | "active" | "closed" | "expired";

export type ApplicationStatus =
  | "Applied"
  | "Reviewed"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Accepted"
  | "Rejected";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  error?: unknown;
}

export interface SalaryRange {
  min: number;
  max: number;
}

export interface CompanySummary {
  _id: string;
  companyName: string;
  logo?: string;
  location?: string;
  industry?: string;
  rating?: number;
  openJobs?: number;
}

export interface Job {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  salary: SalaryRange;
  currency: string;
  experience: string;
  category: string;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  vacancies: number;
  applicationDeadline: string;
  featured: boolean;
  status: JobStatus;
  bannerImage?: string;
  views: number;
  companyId: string;
  company?: CompanySummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  skills: string[];
  experienceYears?: number;
  experience?: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    description?: string;
  }>;
  resume?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  location?: string;
  isVerified: boolean;
  isPremium: boolean;
  searchHistory?: string[];
  profileCompletion?: {
    percentage: number;
    missing: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  ownerId: string;
  companyName: string;
  logo?: string;
  banner?: string;
  website?: string;
  industry: string;
  companySize: string;
  description: string;
  location: string;
  email?: string;
  phone?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  openJobs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: string;
  candidateId: string;
  resume: string;
  coverLetter?: string;
  expectedSalary?: number;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  job?: {
    _id: string;
    title: string;
    slug: string;
    location: string;
    companyName?: string;
    companyLogo?: string;
  } | null;
  candidate?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    skills?: string[];
    resume?: string;
  } | null;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string;
  author: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  experience?: string;
  jobType?: string;
  workMode?: string;
  companyId?: string;
  minSalary?: number;
  maxSalary?: number;
  sort?: string;
  featured?: boolean;
}
