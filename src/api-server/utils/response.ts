/**
 * Standardized API response helpers
 */

import type { ApiErrorResponse, ApiSuccessResponse } from "pocket-agent-sdk";

export const successResponse = <T>(data: T): ApiSuccessResponse<T> => ({
  success: true,
  data,
});

export const errorResponse = (
  message: string,
  code?: string,
  details?: Record<string, unknown>
): ApiErrorResponse => ({
  success: false,
  error: {
    message,
    code,
    details,
  },
});

/**
 * HTTP status code mapping for error types
 */
export const getStatusCode = (code?: string): number => {
  const codeMap: Record<string, number> = {
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    BAD_REQUEST: 400,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  };
  return codeMap[code || "INTERNAL_SERVER_ERROR"] || 500;
};
