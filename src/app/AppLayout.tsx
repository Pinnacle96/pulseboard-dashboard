import { Menu, X, LayoutDashboard, UserRound, LogOut, Activity } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/features/auth/authStore";
import { cn } from "@/lib/cn";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[280px_1fr]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-3 text-lg font-bold">
          <span className="grid size-9 place-items-center rounded-md bg-ink text-amber">
            <Activity aria-hidden="true" size={20} />
          </span>
          PulseBoard
        </div>
        <button
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          className="grid size-10 place-items-center rounded-md text-ink hover:bg-slate-100"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white p-5 transition lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isOpen && "translate-x-0 shadow-soft"
        )}
      >
        <div className="mb-8 hidden items-center gap-3 text-xl font-bold lg:flex">
          <span className="grid size-10 place-items-center rounded-md bg-ink text-amber">
            <Activity aria-hidden="true" size={22} />
          </span>
          PulseBoard
        </div>

        <nav className="grid gap-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted transition hover:bg-slate-100 hover:text-ink",
                  isActive && "bg-brand text-white hover:bg-brand hover:text-white"
                )
              }
            >
              <item.icon aria-hidden="true" size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-lg border border-slate-200 bg-canvas p-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl}
              alt=""
              className="size-11 rounded-full border border-slate-200 bg-white"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
              <p className="truncate text-xs text-muted">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-4 w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {isOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-ink/35 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
