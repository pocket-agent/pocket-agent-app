import type { GoogleUser } from "@api-server/lib/google-auth";
import type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "pocket-agent-sdk";

export interface Env {
  GOOGLE_CLIENT_ID?: string;
  AUTH_MODE?: string;
  ALLOWED_ORIGINS?: string;
  ENVIRONMENT?: string;
  /** Reserved for cloud-relay chat mode (not enabled yet) */
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  /** Proxy target when routing to Pocket Node */
  POCKET_NODE_URL?: string;
}

export interface Variables {
  userId?: string;
  googleUser?: GoogleUser;
}

/** @deprecated use ApiSuccessResponse from pocket-agent-sdk */
export type SuccessResponse<T> = ApiSuccessResponse<T>;

export type { ApiErrorResponse, ApiResponse, ApiSuccessResponse };
