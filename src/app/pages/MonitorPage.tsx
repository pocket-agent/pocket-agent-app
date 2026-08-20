import { Link } from "react-router";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import { useAgentStatus } from "@/hooks/use-agent-status";
import {
  connectionProfileLabel,
  getConnectionProfile,
  apiBaseUrl,
} from "@/lib/connection-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MonitorPage() {
  const profile = getConnectionProfile();
  const localStack = profile === "all-local";
  const { status, loading, error, pocketNodeOnline } = useAgentStatus(true);
  const node = status?.pocket_node;

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            {localStack
              ? "Pocket Node health on this Mac (polled every 30s)."
              : "API worker and Pocket Node health (polled every 30s)."}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <RefreshCwIcon className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
          <CardDescription>From frontend environment variables.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Profile:</span>{" "}
            {connectionProfileLabel(profile)}
          </p>
          <p>
            <span className="text-muted-foreground">API base URL:</span>{" "}
            <code className="text-xs">{apiBaseUrl()}</code>
          </p>
        </CardContent>
      </Card>

      {!localStack && (
        <Card>
          <CardHeader>
            <CardTitle>API worker</CardTitle>
            <CardDescription>Cloudflare Worker gateway status.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <div className="space-y-2 text-sm">
                <p>
                  <span
                    className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                      status ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  Worker online
                </p>
                <p>
                  <span className="text-muted-foreground">Environment:</span>{" "}
                  {status?.environment}
                </p>
                <p>
                  <span className="text-muted-foreground">Pocket Node URL:</span>{" "}
                  <code className="text-xs">{status?.pocket_node_url}</code>
                </p>
                <p>
                  <span className="text-muted-foreground">Pocket Node:</span>{" "}
                  {pocketNodeOnline ? "online" : "offline"}
                  {status?.pocket_node_error ? ` (${status.pocket_node_error})` : ""}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {localStack && (
        <Card>
          <CardHeader>
            <CardTitle>Pocket Node</CardTitle>
            <CardDescription>
              Direct <code className="text-xs">GET /status</code> on{" "}
              <code className="text-xs">{apiBaseUrl()}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm">
                <span
                  className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                    pocketNodeOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {pocketNodeOnline ? "Online" : "Offline"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pocket Node agent</CardTitle>
          <CardDescription>
            {localStack
              ? "Agent runtime on this machine."
              : "From proxied GET /status on the Python agent."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pocketNodeOnline || !node ? (
            <p className="text-sm text-muted-foreground">
              Agent not reachable.
              {localStack
                ? " Quit and reopen Pocket Agent, or check ~/.pocket-agent/logs/bundle-serve.log"
                : " Start with pocket-agent serve or check POCKET_NODE_URL on the worker."}
            </p>
          ) : (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Agent:</span> {node.agent}
              </p>
              <p>
                <span className="text-muted-foreground">LLM:</span>{" "}
                {node.llm_providers?.join(", ") || "none"}
              </p>
              <p>
                <span className="text-muted-foreground">Memories:</span> {node.memory_count}
              </p>
              <p>
                <span className="text-muted-foreground">Knowledge chunks:</span>{" "}
                {node.knowledge_chunks}
              </p>
              <p>
                <span className="text-muted-foreground">Embeddings:</span>{" "}
                {node.embeddings ? "yes" : "no"}
              </p>
              <p>
                <span className="text-muted-foreground">Telegram:</span>{" "}
                {node.telegram_configured ? "configured" : "not configured"}
              </p>
              <p className="sm:col-span-2">
                <span className="text-muted-foreground">NAS root:</span>{" "}
                <code className="text-xs">{node.nas_root}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
