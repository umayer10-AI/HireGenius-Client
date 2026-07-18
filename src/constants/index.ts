export const APP_NAME = "HireGenius AI";
export const APP_TAGLINE = "Land your next role with AI-powered precision";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const JOB_CATEGORIES = [
  "Software Engineering",
  "Product Management",
  "Design",
  "Data Science",
  "Marketing",
  "Sales",
  "Customer Success",
  "Finance",
  "Human Resources",
  "Operations",
  "DevOps",
  "Cybersecurity",
  "AI & Machine Learning",
  "Content Writing",
  "Other",
] as const;

export const EXPERIENCE_LEVELS = [
  "Intern",
  "Entry Level",
  "Junior",
  "Mid Level",
  "Senior",
  "Lead",
  "Executive",
] as const;

export const JOB_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
] as const;

export const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "salary-high", label: "Highest Salary" },
  { value: "salary-low", label: "Lowest Salary" },
  { value: "deadline", label: "Deadline" },
  { value: "alphabetical", label: "Alphabetical" },
] as const;

export const CANDIDATE_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/profile", label: "My Profile", icon: "User" },
  { href: "/dashboard/applications", label: "Applied Jobs", icon: "Briefcase" },
  { href: "/dashboard/saved-jobs", label: "Saved Jobs", icon: "Bookmark" },
  { href: "/dashboard/resume", label: "Resume", icon: "FileText" },
  { href: "/dashboard/ai/resume", label: "AI Resume Builder", icon: "Sparkles" },
  { href: "/dashboard/ai/cover-letter", label: "AI Cover Letter", icon: "PenLine" },
  { href: "/dashboard/ai/recommendations", label: "AI Recommendations", icon: "Target" },
  { href: "/dashboard/ai/chat", label: "Career Chat", icon: "MessageSquare" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "Bell" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;

export const RECRUITER_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/company", label: "Company Profile", icon: "Building2" },
  { href: "/dashboard/jobs/new", label: "Post Job", icon: "PlusCircle" },
  { href: "/dashboard/jobs", label: "Manage Jobs", icon: "Briefcase" },
  { href: "/dashboard/applicants", label: "Applicants", icon: "Users" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/ai/job-description", label: "AI Job Description", icon: "Sparkles" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "Bell" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;

export const ADMIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/users", label: "Users", icon: "Users" },
  { href: "/dashboard/companies", label: "Companies", icon: "Building2" },
  { href: "/dashboard/jobs", label: "Jobs", icon: "Briefcase" },
  { href: "/dashboard/applications", label: "Applications", icon: "FileCheck" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/reports", label: "Reports", icon: "FileBarChart" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "Bell" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;
