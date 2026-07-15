import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Save, UserRound, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useAuthStore } from "@/features/auth/authStore";
import { profileSchema, type ProfileValues } from "@/features/profile/profileSchema";
import { fetchProfile } from "@/lib/api";

export function ProfilePage() {
  const authUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [saved, setSaved] = useState(false);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: Boolean(authUser)
  });

  const user = authUser ?? data;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "",
      location: user?.location ?? "",
      company: user?.company ?? ""
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        company: user.company
      });
    }
  }, [reset, user]);

  const onSubmit = async (values: ProfileValues) => {
    if (!user) return;
    setSaved(false);
    updateUser({
      ...user,
      ...values,
      avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        values.name
      )}`
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (isLoading && !user) {
    return (
      <div className="grid gap-6">
        <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
      </div>
    );
  }

  if (isError && !user) {
    return (
      <section className="grid min-h-[70vh] place-items-center">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
          <h1 className="text-2xl font-bold text-ink">Profile unavailable</h1>
          <p className="mt-3 text-muted">
            We could not load your profile. Please retry the request.
          </p>
          <Button className="mt-6" onClick={() => refetch()}>
            <RefreshCcw aria-hidden="true" size={18} />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
          User profile
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Account details</h1>
        <p className="mt-2 text-muted">
          Manage the profile information shown across your dashboard workspace.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-20 rounded-full border border-slate-200 bg-canvas"
              />
            ) : (
              <span className="grid size-20 place-items-center rounded-full bg-canvas text-muted">
                <UserRound aria-hidden="true" size={34} />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-ink">{user?.name}</h2>
              <p className="truncate text-sm text-muted">{user?.email}</p>
            </div>
          </div>
          <dl className="mt-8 grid gap-4 text-sm">
            <div>
              <dt className="font-semibold text-muted">Role</dt>
              <dd className="mt-1 font-bold text-ink">{user?.role}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Company</dt>
              <dd className="mt-1 font-bold text-ink">{user?.company}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Location</dt>
              <dd className="mt-1 font-bold text-ink">{user?.location}</dd>
            </div>
          </dl>
        </aside>

        <form
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-5 md:grid-cols-2">
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
              label="Role"
              autoComplete="organization-title"
              error={errors.role?.message}
              {...register("role")}
            />
            <Field
              label="Company"
              autoComplete="organization"
              error={errors.company?.message}
              {...register("company")}
            />
            <Field
              label="Location"
              autoComplete="address-level2"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              <Save aria-hidden="true" size={18} />
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            {saved ? (
              <p className="text-sm font-semibold text-emerald-700">
                Profile updated successfully.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
