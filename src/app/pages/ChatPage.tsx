import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2Icon, SendIcon } from "lucide-react";
import { sendChatMessage } from "@/api/chat";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMarkdown } from "@/components/chat-markdown";
import { Button } from "@/components/ui/button";
import {
  createThread,
  deleteThread,
  getActiveThreadId,
  loadChatState,
  setActiveThreadId,
  titleFromMessage,
  upsertThread,
  type ChatMessage,
  type ChatThread,
} from "@/lib/chat-threads";
import { cn } from "@/lib/utils";

function resolveInitialThread(): ChatThread {
  const { threads, activeThreadId } = loadChatState();
  if (threads.length === 0) {
    return createThread();
  }
  const active = threads.find((t) => t.id === activeThreadId) ?? threads[0];
  setActiveThreadId(active.id);
  return active;
}

export default function ChatPage() {
  const [threads, setThreads] = useState<ChatThread[]>(() => loadChatState().threads);
  const [activeThread, setActiveThread] = useState<ChatThread>(resolveInitialThread);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = activeThread.messages;

  const syncThread = useCallback((thread: ChatThread) => {
    upsertThread(thread);
    setThreads(loadChatState().threads);
    setActiveThread(thread);
    setActiveThreadId(thread.id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, activeThread.id]);

  const handleNewChat = () => {
    const thread = createThread();
    setThreads(loadChatState().threads);
    setActiveThread(thread);
    setInput("");
    setError(null);
  };

  const handleSelectThread = (id: string) => {
    const thread = threads.find((t) => t.id === id);
    if (!thread) return;
    setActiveThreadId(id);
    setActiveThread(thread);
    setInput("");
    setError(null);
  };

  const handleDeleteThread = (id: string) => {
    deleteThread(id);
    const next = loadChatState();
    setThreads(next.threads);
    if (next.threads.length === 0) {
      setActiveThread(createThread());
      setThreads(loadChatState().threads);
      return;
    }
    const activeId = getActiveThreadId();
    const thread = next.threads.find((t) => t.id === activeId) ?? next.threads[0];
    setActiveThread(thread);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const history = activeThread.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const withUser: ChatThread = {
      ...activeThread,
      title:
        activeThread.messages.length === 0
          ? titleFromMessage(trimmed)
          : activeThread.title,
      messages: [...activeThread.messages, userMsg],
    };

    syncThread(withUser);
    setInput("");
    setLoading(true);
    setError(null);

    const { data, error: apiError } = await sendChatMessage(trimmed, history);
    setLoading(false);

    if (apiError || !data) {
      setError(apiError ?? "Failed to get a reply");
      return;
    }

    const withReply: ChatThread = {
      ...withUser,
      messages: [
        ...withUser.messages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
        },
      ],
    };

    syncThread(withReply);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="chat-full-bleed flex h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      <ChatSidebar
        threads={threads}
        activeThreadId={activeThread.id}
        onSelect={handleSelectThread}
        onNewChat={handleNewChat}
        onDelete={handleDeleteThread}
      />

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">AI Chat</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Each thread keeps context for follow-up messages. History is stored
            in this browser session only.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && !loading && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Send a message to start this conversation.
              </p>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-4 py-2 text-sm",
                    msg.role === "user"
                      ? "whitespace-pre-wrap bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <ChatMarkdown content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {error && (
            <p className="border-t px-4 py-2 text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2 border-t p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
              rows={2}
              disabled={loading}
              className="flex min-h-[2.5rem] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              type="button"
              size="icon"
              className="shrink-0 self-end"
              disabled={loading || !input.trim()}
              onClick={() => void handleSend()}
              aria-label="Send message"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
