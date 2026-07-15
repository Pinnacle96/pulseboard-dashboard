import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Field({ label, error, id, className, ...props }: FieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="grid gap-2 text-sm font-medium text-ink" htmlFor={fieldId}>
      {label}
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(
          "min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-ink shadow-sm transition placeholder:text-slate-400 focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500",
          className
        )}
        {...props}
      />
      {error ? (
        <span id={`${fieldId}-error`} className="text-sm font-medium text-coral">
          {error}
        </span>
      ) : null}
    </label>
  );
}
