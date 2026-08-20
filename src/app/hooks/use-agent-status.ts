import { useEffect, useState } from "react";
import { fetchAgentStatus, type AgentStatus } from "@/api/status";

const POLL_INTERVAL_MS = 30_000;

/** Pocket Node direct `/status` vs API worker proxy envelope. */
function normalizeAgentStatus(data: AgentStatus): AgentStatus {
  if (data.pocket_node != null || data.pocket_node_online != null) {
    return data;
  }
  if (data.agent != null || data.llm_providers != null) {
    return {
      ...data,
      pocket_node_online: true,
      pocket_node: {
        agent: data.agent,
        llm_providers: data.llm_providers,
        memory_count: data.memory_count,
        knowledge_chunks: data.knowledge_chunks,
        embeddings: data.embeddings,
        nas_root: data.nas_root,
        telegram_configured: data.telegram_configured,
      },
    };
  }
  return data;
}

export function useAgentStatus(poll = true) {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error: apiError } = await fetchAgentStatus();
      if (cancelled) return;
      if (apiError || !data) {
        setError(apiError ?? "Failed to load status");
        setStatus(null);
      } else {
        setError(null);
        setStatus(normalizeAgentStatus(data));
      }
      setLoading(false);
    };

    load();

    if (!poll) return () => { cancelled = true; };

    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [poll]);

  return {
    status,
    loading,
    error,
    pocketNodeOnline: status?.pocket_node_online ?? false,
  };
}
