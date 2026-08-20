import { MessageSquarePlusIcon, Trash2Icon } from "lucide-react";
import type { ChatThread } from "@/lib/chat-threads";
import { formatThreadTime } from "@/lib/chat-threads";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatSidebarProps = {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
};

export function ChatSidebar({
  threads,
  activeThreadId,
  onSelect,
  onNewChat,
  onDelete,
}: ChatSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b bg-muted/30 md:w-56 md:border-b-0 md:border-r">
      <div className="p-3">
        <Button className="w-full justify-start gap-2" onClick={onNewChat}>
          <MessageSquarePlusIcon className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <nav className="flex max-h-40 gap-2 overflow-x-auto px-2 pb-3 md:max-h-none md:flex-1 md:flex-col md:overflow-y-auto md:pb-2">
        {threads.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground md:text-left">
            Chats appear here for this browser session.
          </p>
        )}

        {threads.map((thread) => {
          const active = thread.id === activeThreadId;
          return (
            <div key={thread.id} className="group relative shrink-0 md:shrink">
              <button
                type="button"
                onClick={() => onSelect(thread.id)}
                className={cn(
                  "w-44 rounded-lg px-3 py-2 text-left text-sm transition-colors md:w-full",
                  active
                    ? "bg-background shadow-sm ring-1 ring-border"
                    : "hover:bg-background/70"
                )}
              >
                <p className="truncate font-medium">{thread.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {formatThreadTime(thread.updatedAt)}
                </p>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 md:right-0.5"
                aria-label={`Delete ${thread.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(thread.id);
                }}
              >
                <Trash2Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
