import { Context, Next } from "hono";
import { cors } from "hono/cors";
import { isLocalAuth, localDevGoogleUser } from "@api-server/lib/auth-mode";
import { getAuthenticatedUser } from "@api-server/utils/auth";
import { errorResponse } from "@api-server/utils/response";
import { Env, Variables } from "@api-server/types";

/**
 * Verifies Google OAuth ID token (Bearer JWT) and attaches user to context.
 * When AUTH_MODE=none (local wrangler dev only), uses a synthetic local user.
 */
export const authMiddleware = async (
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) => {
  if (isLocalAuth(c.env)) {
    const user = localDevGoogleUser();
    c.set("userId", user.sub);
    c.set("googleUser", user);
    await next();
    return;
  }

  const user = await getAuthenticatedUser(c);

  if (!user) {
    return c.json(errorResponse("Unauthorized", "UNAUTHORIZED"), { status: 401 });
  }

  c.set("userId", user.sub);
  c.set("googleUser", user);
  await next();
};

export const corsMiddleware = cors({
  origin: (origin, c) => {
    const allowed = c.env.ALLOWED_ORIGINS?.split(",").map((o: string) => o.trim()) ?? [];
    if (allowed.length === 0) {
      return origin || "*";
    }
    if (!origin) {
      return allowed[0];
    }
    return allowed.includes(origin) ? origin : allowed[0];
  },
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});

export const errorHandler = async (
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) => {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof Error) {
      return c.json(
        errorResponse(error.message || "Internal server error", "INTERNAL_SERVER_ERROR"),
        { status: 500 }
      );
    }

    return c.json(
      errorResponse("An unexpected error occurred", "INTERNAL_SERVER_ERROR"),
      { status: 500 }
    );
  }
};
