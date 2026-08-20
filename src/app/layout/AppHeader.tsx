import { Link, useLocation } from "react-router";
import { useApiHealth } from "@/hooks/use-api-health";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import logo from "@/assets/pocket-agent-logo.png";
import {
  connectionProfileLabel,
  getConnectionProfile,
} from "@/lib/connection-profile";

const navLinkClass = (active: boolean) =>
  cn(
    "text-sm font-medium transition-colors hover:text-foreground",
    active ? "text-foreground" : "text-muted-foreground"
  );

export function AppHeader() {
  const apiStatus = useApiHealth();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const profile = getConnectionProfile();
  const localStack = profile === "all-local";

  const statusLabel =
    apiStatus === "checking"
      ? localStack
        ? "Starting…"
        : "Checking API…"
      : apiStatus === "online"
        ? localStack
          ? "Pocket Node online"
          : "API online"
        : localStack
          ? "Pocket Node offline"
          : "API offline";

  const statusColor =
    apiStatus === "checking"
      ? "bg-yellow-500"
      : apiStatus === "online"
        ? "bg-green-500"
        : "bg-red-500";

  const profileLabel = connectionProfileLabel(getConnectionProfile());

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-8 w-8 rounded-md object-cover" />
          <span className="font-semibold">Pocket Agent</span>
          {user && (
            <nav className="ml-2 hidden items-center gap-4 sm:flex">
              <Link to="/" className={navLinkClass(location.pathname === "/")}>
                Home
              </Link>
              <Link
                to="/monitor"
                className={navLinkClass(location.pathname === "/monitor")}
              >
                Monitor
              </Link>
              <Link
                to="/settings"
                className={navLinkClass(location.pathname === "/settings")}
              >
                Settings
              </Link>
              <Link
                to="/chat"
                className={navLinkClass(location.pathname === "/chat")}
              >
                Chat
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"
            title="Connection profile"
          >
            <span className="rounded-md border px-2 py-0.5">{profileLabel}</span>
          </div>

          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            title={statusLabel}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
            <span className="hidden sm:inline">{statusLabel}</span>
          </div>

          <ThemeToggle />

          {user && (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
