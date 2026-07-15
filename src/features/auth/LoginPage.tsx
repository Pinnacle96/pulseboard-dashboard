import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useAuthStore } from "@/features/auth/authStore";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "maya@example.com", password: "password123" }
  });

  const onSubmit = async (values: LoginValues) => {
    setError("");
    try {
      await login(values);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("We could not sign you in. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
        Welcome back
      </p>
      <h1 className="mt-3 text-3xl font-bold text-ink">Sign in</h1>
      <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          <LogIn aria-hidden="true" size={18} />
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link className="font-semibold text-brand hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
