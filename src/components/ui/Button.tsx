import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
  }
>;

const variants = {
  primary: "bg-brand text-white hover:bg-blue-700",
  secondary: "bg-ink text-white hover:bg-slate-800",
  ghost: "bg-transparent text-muted hover:bg-slate-100 hover:text-ink",
  danger: "bg-coral text-white hover:bg-rose-700"
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
