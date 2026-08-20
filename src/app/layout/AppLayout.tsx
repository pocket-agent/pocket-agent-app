import { Outlet } from "react-router";
import { AppHeader } from "@/layout/AppHeader";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 p-4 [&:has(.chat-full-bleed)]:max-w-none [&:has(.chat-full-bleed)]:p-0">
        <Outlet />
      </main>
    </div>
  );
}
