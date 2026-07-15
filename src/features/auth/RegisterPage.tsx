import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useAuthStore } from "@/features/auth/authStore";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";

export function RegisterPage() {
  const registerUser = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      await registerUser(values);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("We could not create your account. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
        Get started
      </p>
      <h1 className="mt-3 text-3xl font-bold text-ink">Create account</h1>
      <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          <UserPlus aria-hidden="true" size={18} />
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="font-semibold text-brand hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
