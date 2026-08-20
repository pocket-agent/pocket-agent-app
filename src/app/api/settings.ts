import { API_BASE_URL, apiFetch } from "@/api/api";

export interface LlmProviderStatus {
  id: string;
  label: string;
  connected: boolean;
  model: string;
  active: boolean;
  error?: string | null;
}

export interface LlmSettingsData {
  active_provider: string;
  active_model: string;
  providers: LlmProviderStatus[];
  ollama_installed_models: string[];
  ollama_recommended: string[];
}

export async function fetchLlmSettings(): Promise<{
  data?: LlmSettingsData;
  error?: string;
}> {
  const url = new URL("/settings/llm", API_BASE_URL);
  return apiFetch(url, { method: "GET" });
}

export async function updateLlmSettings(body: {
  provider?: string;
  ollama_model?: string;
  pull_ollama_model?: string;
}): Promise<{ data?: LlmSettingsData; error?: string }> {
  const url = new URL("/settings/llm", API_BASE_URL);
  return apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export interface MemorySettingsData {
  enabled: boolean;
  memory_count: number;
  erased_count?: number;
}

export async function fetchMemorySettings(): Promise<{
  data?: MemorySettingsData;
  error?: string;
}> {
  const url = new URL("/settings/memory", API_BASE_URL);
  return apiFetch(url, { method: "GET" });
}

export async function updateMemorySettings(body: {
  enabled?: boolean;
  erase_all?: boolean;
}): Promise<{ data?: MemorySettingsData; error?: string }> {
  const url = new URL("/settings/memory", API_BASE_URL);
  return apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
