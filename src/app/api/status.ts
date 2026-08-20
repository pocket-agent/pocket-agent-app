import { API_BASE_URL, apiFetch } from "@/api/api";

export interface AgentStatus {
  service?: string;
  environment?: string;
  pocket_node_url?: string;
  pocket_node_online?: boolean;
  pocket_node_error?: string | null;
  agent?: string;
  llm_providers?: string[];
  memory_count?: number;
  knowledge_chunks?: number;
  embeddings?: boolean;
  nas_root?: string;
  telegram_configured?: boolean;
  pocket_node?: {
    agent?: string;
    llm_providers?: string[];
    memory_count?: number;
    knowledge_chunks?: number;
    embeddings?: boolean;
    nas_root?: string;
    telegram_configured?: boolean;
  } | null;
  timestamp?: string;
}

export async function fetchAgentStatus(): Promise<{
  data?: AgentStatus;
  error?: string;
}> {
  const url = new URL("/status", API_BASE_URL);
  return apiFetch(url, { method: "GET" }, false);
}
