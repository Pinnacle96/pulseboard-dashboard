import {
  Menu,
  X,
  LayoutDashboard,
  UserRound,
  LogOut,
  Activity,
  Moon,
  Search,
  Sun
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../features/auth/authStore";
import { useThemeStore } from "../features/theme/themeStore";
import { cn } from "../lib/cn";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: UserRound }
];

const pageMeta: Record<string, { title: string; eyebrow: string }> = {
  "/dashboard": {
    title: "Business overview",
    eyebrow: "Dashboard"
  },
  "/profile": {
    title: "Account details",
    eyebrow: "User profile"
  }
};

export function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = pageMeta[location.pathname] ?? pageMeta["/dashboard"];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[280px_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
        <div className="flex items-center gap-3 text-lg font-bold">
          <span className="grid size-9 place-items-center rounded-md bg-ink text-amber">
            <Activity aria-hidden="true" size={20} />
          </span>
          PulseBoard
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="grid size-10 place-items-center rounded-md text-ink hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun aria-hidden="true" size={20} />
            ) : (
              <Moon aria-hidden="true" size={20} />
            )}
          </button>
          <button
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            className="grid size-10 place-items-center rounded-md text-ink hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <aside
        aria-label="Sidebar navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white p-5 transition dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
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
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted transition hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  isActive && "bg-brand text-white hover:bg-brand hover:text-white"
                )
              }
            >
              <item.icon aria-hidden="true" size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-lg border border-slate-200 bg-canvas p-4 dark:border-slate-800 dark:bg-slate-900">
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
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun aria-hidden="true" size={18} />
            ) : (
              <Moon aria-hidden="true" size={18} />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
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

      <div className="min-w-0">
        <div className="sticky top-0 z-20 hidden h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:flex">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
              {currentPage.eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-ink">{currentPage.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative block w-72">
              <Search
                aria-hidden="true"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <span className="sr-only">Search workspace</span>
              <input
                placeholder="Search workspace..."
                className="min-h-11 w-full rounded-md border border-slate-200 bg-canvas pl-10 pr-3 text-sm text-ink shadow-sm transition placeholder:text-slate-400 focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <button
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="grid size-11 place-items-center rounded-md border border-slate-200 bg-canvas text-ink transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun aria-hidden="true" size={20} />
              ) : (
                <Moon aria-hidden="true" size={20} />
              )}
            </button>
            <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-canvas px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <img
                src={user?.avatarUrl}
                alt=""
                className="size-8 rounded-full border border-slate-200 bg-white dark:border-slate-700"
              />
              <div className="max-w-40">
                <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
                <p className="truncate text-xs text-muted">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="min-w-0 px-4 py-6 focus:outline-none sm:px-6 lg:px-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
