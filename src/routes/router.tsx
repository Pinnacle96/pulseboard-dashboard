import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../app/AppLayout";
import { AuthLayout } from "../features/auth/AuthLayout";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";

const DashboardPage = lazy(() =>
  import("../features/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage
  }))
);
const ProfilePage = lazy(() =>
  import("../features/profile/ProfilePage").then((module) => ({
    default: module.ProfilePage
  }))
);

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <DashboardPage />
              </Suspense>
            )
          },
          {
            path: "/profile",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <ProfilePage />
              </Suspense>
            )
          }
        ]
      }
    ]
  },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> }
]);
