export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const THREADS_KEY = "chat-threads";
const ACTIVE_THREAD_KEY = "chat-active-thread-id";

function readThreads(): ChatThread[] {
  try {
    const raw = sessionStorage.getItem(THREADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeThreads(threads: ChatThread[]) {
  sessionStorage.setItem(THREADS_KEY, JSON.stringify(threads));
}

export function getActiveThreadId(): string | null {
  return sessionStorage.getItem(ACTIVE_THREAD_KEY);
}

export function setActiveThreadId(id: string) {
  sessionStorage.setItem(ACTIVE_THREAD_KEY, id);
}

export function loadChatState(): {
  threads: ChatThread[];
  activeThreadId: string | null;
} {
  return {
    threads: readThreads(),
    activeThreadId: getActiveThreadId(),
  };
}

export function createThread(): ChatThread {
  const thread: ChatThread = {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    updatedAt: Date.now(),
  };
  const threads = [thread, ...readThreads()];
  writeThreads(threads);
  setActiveThreadId(thread.id);
  return thread;
}

export function upsertThread(thread: ChatThread) {
  const threads = readThreads();
  const index = threads.findIndex((t) => t.id === thread.id);
  const next = { ...thread, updatedAt: Date.now() };

  if (index === -1) {
    writeThreads([next, ...threads]);
    return;
  }

  const updated = [...threads];
  updated[index] = next;
  updated.sort((a, b) => b.updatedAt - a.updatedAt);
  writeThreads(updated);
}

export function deleteThread(threadId: string) {
  const threads = readThreads().filter((t) => t.id !== threadId);
  writeThreads(threads);
  if (getActiveThreadId() === threadId) {
    if (threads[0]) {
      setActiveThreadId(threads[0].id);
    } else {
      sessionStorage.removeItem(ACTIVE_THREAD_KEY);
    }
  }
}

/** Remove all chat threads from sessionStorage (e.g. on sign out). */
export function clearAllChatState() {
  sessionStorage.removeItem(THREADS_KEY);
  sessionStorage.removeItem(ACTIVE_THREAD_KEY);
}

export function titleFromMessage(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "New chat";
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed;
}

export function formatThreadTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
