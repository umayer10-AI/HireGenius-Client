"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldProps
>(({ label, error, hint, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <label className={cn("flex w-full flex-col gap-2", className)}>
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 w-full rounded-[14px] border bg-card px-4 text-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-danger focus:border-danger focus:ring-danger/20"
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ label, error, hint, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <label className={cn("flex w-full flex-col gap-2", className)}>
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "min-h-28 w-full rounded-[14px] border bg-card px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-danger focus:border-danger focus:ring-danger/20"
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
});
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(({ label, error, hint, className, id, children, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <label className={cn("flex w-full flex-col gap-2", className)}>
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 w-full rounded-[14px] border bg-card px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-danger focus:border-danger focus:ring-danger/20"
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
});
Select.displayName = "Select";
