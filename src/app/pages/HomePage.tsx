import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Loader2Icon, MessageSquareIcon } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { fetchMe, type MeResponse } from "@/api/me";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error: apiError } = await fetchMe();
      if (cancelled) return;
      if (apiError || !data) {
        setError(apiError ?? "Failed to load profile");
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground mt-1">
            You are signed in. This page calls the protected{" "}
            <code className="text-sm">GET /me</code> endpoint on your worker to
            verify JWT auth end-to-end.
          </p>
        </div>
        <Button asChild>
          <Link to="/chat">
            <MessageSquareIcon className="h-4 w-4" />
            Open AI chat
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session (Google)</CardTitle>
          <CardDescription>From the Google ID token in the browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Email:</span> {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">User ID:</span> {user?.id}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile (API /me)</CardTitle>
          <CardDescription>
            Server-validated profile JSON using your Bearer token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Loading profile…
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
