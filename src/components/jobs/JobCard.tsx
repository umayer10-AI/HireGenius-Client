"use client";

import Link from "next/link";
import { Bookmark, MapPin, Banknote, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import type { Job } from "@/types";
import { Badge, Card } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { formatDate, formatSalary } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  saved?: boolean;
}

export function JobCard({ job, onSave, saved }: JobCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="gradient-border flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
              {job.company?.companyName?.slice(0, 2).toUpperCase() || "HG"}
            </div>
            <div>
              <p className="text-sm text-muted">{job.company?.companyName || "Company"}</p>
              <h3 className="text-lg font-semibold leading-tight">{job.title}</h3>
            </div>
          </div>
          {onSave ? (
            <button
              type="button"
              aria-label={saved ? "Remove bookmark" : "Save job"}
              onClick={() => onSave(job._id)}
              className="rounded-full p-2 text-muted transition hover:bg-primary/10 hover:text-primary"
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
            </button>
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm text-muted">{job.shortDescription}</p>

        <div className="flex flex-wrap gap-2">
          <Badge>{job.jobType}</Badge>
          <Badge tone="secondary">{job.workMode}</Badge>
          <Badge tone="accent">{job.experience}</Badge>
        </div>

        <div className="mt-auto space-y-2 text-sm text-muted">
          <p className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            {formatSalary(job.salary.min, job.salary.max, job.currency)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {job.location}
          </p>
          <p className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            Deadline {formatDate(job.applicationDeadline)}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/jobs/${job.slug || job._id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/jobs/${job.slug || job._id}?apply=1`} className="flex-1">
            <Button className="w-full">Apply</Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
