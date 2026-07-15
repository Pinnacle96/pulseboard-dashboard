import { Navigate, Outlet } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuthStore } from "./authStore";

export function AuthLayout() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[1fr_1.1fr]">
      <section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-md bg-amber text-ink">
            <Activity aria-hidden="true" size={22} />
          </span>
          PulseBoard
        </div>
        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-amber">
            Production analytics
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Clear operating data for fast-moving product teams.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Metrics, customer activity, and profile management in one responsive
            workspace.
          </p>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <Outlet />
      </section>
    </main>
  );
}
