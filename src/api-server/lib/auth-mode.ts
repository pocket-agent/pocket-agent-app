import { LOCAL_DEV_USER, LOCAL_DEV_USER_ID } from "pocket-agent-sdk";
import type { Env } from "@api-server/types";
import type { GoogleUser } from "@api-server/lib/google-auth";

/** Local all-local stack: skip Google JWT (never in production). */
export function isLocalAuth(env: Env): boolean {
  if (env.ENVIRONMENT === "production") {
    return false;
  }
  return env.AUTH_MODE === "none";
}

export function localDevGoogleUser(): GoogleUser {
  return {
    sub: LOCAL_DEV_USER_ID,
    email: LOCAL_DEV_USER.email,
    name: LOCAL_DEV_USER.name,
    email_verified: true,
  };
}
