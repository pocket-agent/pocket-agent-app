import { LOCAL_DEV_USER } from "pocket-agent-sdk";
import type { AuthUser } from "@/lib/google-auth";

/** `none` = all-local stack (browser + Tauri); `google` = Cloudflare / hosted. */
export function isLocalAuthMode(): boolean {
  return import.meta.env.VITE_AUTH_MODE === "none";
}

export function localAuthUser(): AuthUser {
  return {
    id: LOCAL_DEV_USER.id,
    email: LOCAL_DEV_USER.email,
    name: LOCAL_DEV_USER.name,
  };
}
