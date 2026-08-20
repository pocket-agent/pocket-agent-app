import { API_BASE_URL, apiFetch } from "@/api/api";
import type { ChatRole } from "@/lib/chat-threads";

export type ChatHistoryItem = {
  role: ChatRole;
  content: string;
};

export interface ChatCompletionResponse {
  message: string;
  reply: string;
  model: string;
}

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[] = []
): Promise<{
  data?: ChatCompletionResponse;
  error?: string;
}> {
  const url = new URL("/chat", API_BASE_URL);
  return apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
}
