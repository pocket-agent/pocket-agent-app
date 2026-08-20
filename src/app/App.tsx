import { Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Loader2Icon } from "lucide-react";
import { AuthProvider } from "@/auth/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthGuard } from "@/auth/AuthGuard";
import { ErrorBoundary } from "@/components/error-boundary";
import { RouteErrorFallback } from "@/components/error-router-fallback";
import { Toaster } from "sonner";
import { AppLayout } from "@/layout/AppLayout";
import { isLocalAuthMode } from "@/lib/auth-config";
import LogInPage from "@/auth/pages/LogInPage";
import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import MonitorPage from "@/pages/MonitorPage";
import SettingsPage from "@/pages/SettingsPage";
import WelcomePage from "@/pages/WelcomePage";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const localAuth = isLocalAuthMode();

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: "/",
        element: (
          <AuthGuard requireAuth>
            <HomePage />
          </AuthGuard>
        ),
      },
      {
        path: "/monitor",
        element: (
          <AuthGuard requireAuth>
            <MonitorPage />
          </AuthGuard>
        ),
      },
      {
        path: "/chat",
        element: (
          <AuthGuard requireAuth>
            <ChatPage />
          </AuthGuard>
        ),
      },
      {
        path: "/welcome",
        element: (
          <AuthGuard requireAuth>
            <WelcomePage />
          </AuthGuard>
        ),
      },
      {
        path: "/settings",
        element: (
          <AuthGuard requireAuth>
            <SettingsPage />
          </AuthGuard>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthGuard requireAuth={false}>
            <LogInPage />
          </AuthGuard>
        ),
      },
      {
        path: "/signup",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/recover-password",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/reset-password",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

function AppShell() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster position="top-right" richColors />
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function App() {
  if (!localAuth && !googleClientId) {
    return (
      <div className="flex h-screen items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env.local</code>
          (or <code>VITE_AUTH_MODE=none</code> for local all-local dev).
        </p>
      </div>
    );
  }

  if (localAuth) {
    return <AppShell />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppShell />
    </GoogleOAuthProvider>
  );
}

export default App;
