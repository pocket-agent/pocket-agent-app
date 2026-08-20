import { Link } from "react-router";
import { MessageSquareIcon, SettingsIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  isDesktopBundle,
  markOnboardingComplete,
} from "@/lib/desktop-bundle";
import { getConnectionProfile } from "@/lib/connection-profile";

export default function WelcomePage() {
  const profile = getConnectionProfile();
  const desktop = isDesktopBundle();

  const finish = () => {
    markOnboardingComplete();
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {desktop ? "Pocket Agent is ready" : "Welcome to Pocket Agent"}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {desktop
            ? "Everything for this Mac is bundled in one app — Pocket Node, chat UI, and settings. No separate API worker or manual install steps."
            : "You’re connected to your Pocket Agent stack."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            Get started in two steps
          </CardTitle>
          <CardDescription>
            Profile: <strong>{profile}</strong> — local auth, no Google sign-in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>
              Open <strong className="text-foreground">Settings</strong> and pick
              your LLM (e.g. Ollama on this Mac).
            </li>
            <li>
              Open <strong className="text-foreground">Chat</strong> and send a
              message — tools and memory run on your Pocket Node.
            </li>
          </ol>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild onClick={finish}>
              <Link to="/settings">
                <SettingsIcon className="h-4 w-4" />
                Configure LLM
              </Link>
            </Button>
            <Button variant="default" asChild onClick={finish}>
              <Link to="/chat">
                <MessageSquareIcon className="h-4 w-4" />
                Open chat
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {desktop && (
        <p className="text-xs text-muted-foreground">
          Pocket Node runs locally on <code className="text-xs">127.0.0.1:8787</code>.
          Quit Pocket Agent from the menu bar or dock to stop it.
        </p>
      )}
    </div>
  );
}
