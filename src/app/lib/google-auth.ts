export const AUTH_TOKEN_KEY = "x-auth-token";

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function userFromIdToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.sub) return null;

  const exp = payload.exp as number | undefined;
  if (exp && Date.now() >= exp * 1000) {
    return null;
  }

  return {
    id: String(payload.sub),
    email: payload.email as string | undefined,
    name: payload.name as string | undefined,
    picture: payload.picture as string | undefined,
  };
}

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
