import {
  type WebConnectionProfile,
  connectionProfileLabel,
  isConnectionProfile,
} from "pocket-agent-sdk";

export type ConnectionProfile = WebConnectionProfile;

export function getConnectionProfile(): ConnectionProfile {
  const raw = import.meta.env.VITE_CONNECTION_PROFILE?.trim();
  if (raw && isConnectionProfile(raw)) {
    return raw;
  }
  return "custom";
}

export { connectionProfileLabel };

export function apiBaseUrl(): string {
  const env = import.meta.env.VITE_API_BASE_URL?.trim();
  if (env) return env;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:5173";
}
