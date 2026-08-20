import { useCallback, useEffect, useState } from "react";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import {
  fetchLlmSettings,
  fetchMemorySettings,
  updateLlmSettings,
  updateMemorySettings,
  type LlmSettingsData,
  type MemorySettingsData,
} from "@/api/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function SettingsPage() {
  const [data, setData] = useState<LlmSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pullModel, setPullModel] = useState("gemma3:4b");
  const [ollamaModel, setOllamaModel] = useState("");
  const [memorySettings, setMemorySettings] = useState<MemorySettingsData | null>(null);
  const [memoryLoading, setMemoryLoading] = useState(true);

  const loadMemory = useCallback(async () => {
    setMemoryLoading(true);
    const res = await fetchMemorySettings();
    setMemoryLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) setMemorySettings(res.data);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchLlmSettings();
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) {
      setData(res.data);
      setOllamaModel(res.data.active_model);
    }
  }, []);

  useEffect(() => {
    load();
    loadMemory();
  }, [load, loadMemory]);

  const selectProvider = async (providerId: string) => {
    setBusy(true);
    const res = await updateLlmSettings({ provider: providerId });
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) setData(res.data);
    toast.success(`Using ${providerId} for chat`);
  };

  const applyOllamaModel = async () => {
    if (!ollamaModel.trim()) return;
    setBusy(true);
    const res = await updateLlmSettings({
      provider: "ollama",
      ollama_model: ollamaModel.trim(),
    });
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) setData(res.data);
    toast.success(`Ollama model: ${ollamaModel}`);
  };

  const pullOllama = async () => {
    const name = pullModel.trim();
    if (!name) return;
    setBusy(true);
    toast.message(`Pulling ${name}… (can take several minutes)`);
    const res = await updateLlmSettings({
      provider: "ollama",
      pull_ollama_model: name,
    });
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) {
      setData(res.data);
      setOllamaModel(res.data.active_model);
    }
    toast.success(`Pulled and selected ${name}`);
  };

  const toggleMemory = async (enabled: boolean) => {
    setBusy(true);
    const res = await updateMemorySettings({ enabled });
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) setMemorySettings(res.data);
    toast.success(enabled ? "Personal memory enabled" : "Personal memory disabled");
  };

  const eraseAllMemory = async () => {
    const count = memorySettings?.memory_count ?? 0;
    if (count === 0) {
      toast.message("No stored memories to erase");
      return;
    }
    if (
      !window.confirm(
        `Erase all ${count} stored personal memories? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    const res = await updateMemorySettings({ erase_all: true });
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.data) setMemorySettings(res.data);
    toast.success(`Erased ${res.data?.erased_count ?? count} memories`);
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            LLM providers for local chat — Ollama on your Mac, or cloud when configured.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { load(); loadMemory(); }} disabled={loading || busy}>
          <RefreshCwIcon className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected providers</CardTitle>
          <CardDescription>
            Active provider is used for Chat. For M1 8GB RAM, use Ollama with a small model
            (e.g. gemma3:4b, qwen2.5:3b).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : !data ? (
            <p className="text-sm text-destructive">Could not load settings.</p>
          ) : (
            <>
              <p className="text-sm">
                <span className="text-muted-foreground">Active:</span>{" "}
                <code className="text-xs">
                  {data.active_provider} / {data.active_model}
                </code>
              </p>
              <ul className="space-y-3">
                {data.providers.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            p.connected ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="font-medium">{p.label}</span>
                        {p.active && (
                          <span className="text-xs rounded-md border px-1.5 py-0.5 text-muted-foreground">
                            active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Model: {p.model || "—"}
                        {p.error ? ` · ${p.error}` : ""}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={p.active ? "secondary" : "outline"}
                      disabled={busy || !p.connected || p.active}
                      onClick={() => selectProvider(p.id)}
                    >
                      Use for chat
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal memory</CardTitle>
          <CardDescription>
            Facts the agent remembers about you (via chat or /remember). Does not delete the
            knowledge base (/kb). When disabled, recall and new memories are turned off.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {memoryLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : !memorySettings ? (
            <p className="text-sm text-destructive">Could not load memory settings.</p>
          ) : (
            <>
              <p className="text-sm">
                <span className="text-muted-foreground">Stored memories:</span>{" "}
                <code className="text-xs">{memorySettings.memory_count}</code>
              </p>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border"
                  checked={memorySettings.enabled}
                  disabled={busy}
                  onChange={(e) => toggleMemory(e.target.checked)}
                />
                <span>Enable personal memory</span>
              </label>
              <Button
                variant="destructive"
                size="sm"
                disabled={busy || memorySettings.memory_count === 0}
                onClick={() => eraseAllMemory()}
              >
                Erase all memories
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ollama (local)</CardTitle>
          <CardDescription>
            Install{" "}
            <a
              href="https://ollama.com"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              Ollama
            </a>
            , then pull a small model. Pocket Agent talks to{" "}
            <code className="text-xs">localhost:11434</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data && (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Pull model</label>
                  <select
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={pullModel}
                    onChange={(e) => setPullModel(e.target.value)}
                  >
                    {data.ollama_recommended.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={() => pullOllama()} disabled={busy}>
                  {busy ? "Working…" : "Download via Ollama"}
                </Button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Active Ollama model</label>
                  <select
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                  >
                    {data.ollama_installed_models.length === 0 ? (
                      <option value="">No models installed yet</option>
                    ) : (
                      data.ollama_installed_models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))
                    )}
                  </select>
                </div>
                <Button variant="outline" onClick={() => applyOllamaModel()} disabled={busy}>
                  Apply model
                </Button>
              </div>

              {data.ollama_installed_models.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Installed: {data.ollama_installed_models.join(", ")}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
