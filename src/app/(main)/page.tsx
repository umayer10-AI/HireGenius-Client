import { jobsService } from "@/services/jobs.service";
import { HomePageClient } from "@/components/home/HomePageClient";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof jobsService.list>>["data"] = [];
  let stats = { jobs: 0, companies: 0, candidates: 0, recruiters: 0, applications: 0 };
  let categories: Array<{ name: string; count: number }> = [];

  try {
    const [featuredRes, statsRes, categoriesRes] = await Promise.all([
      jobsService.featured(),
      jobsService.platformStats(),
      jobsService.categories(),
    ]);
    featured = featuredRes.data;
    stats = statsRes.data;
    categories = categoriesRes.data;
  } catch {
    // Render marketing page even if API is offline
  }

  return <HomePageClient featured={featured} stats={stats} categories={categories} />;
}
