"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./Button";
import { Select } from "./Input";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizes?: number[];
}

export function Pagination({
  meta,
  onPageChange,
  onLimitChange,
  pageSizes = [10, 12, 20, 30, 50],
}: PaginationProps) {
  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1).filter((page) => {
    if (meta.totalPages <= 7) return true;
    return (
      page === 1 ||
      page === meta.totalPages ||
      Math.abs(page - meta.page) <= 1
    );
  });

  return (
    <div className="mt-8 flex flex-col gap-4 rounded-[20px] border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted">
        Showing page <span className="font-medium text-foreground">{meta.page}</span> of{" "}
        <span className="font-medium text-foreground">{meta.totalPages}</span> · {meta.total} results
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-label="First page"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label="Previous page"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev && page - prev > 1;
          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis ? <span className="px-1 text-muted">…</span> : null}
              <Button
                size="sm"
                variant={page === meta.page ? "primary" : "outline"}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            </div>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          aria-label="Next page"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label="Last page"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

        {onLimitChange ? (
          <Select
            aria-label="Rows per page"
            className="w-28"
            value={meta.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </Select>
        ) : null}
      </div>
    </div>
  );
}
