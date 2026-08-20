import { toast } from "sonner";
import { isLocalAuthMode } from "@/lib/auth-config";
import { clearStoredToken } from "@/lib/google-auth";

function resolveApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_BASE_URL?.trim();
  if (env) return env;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:5173";
}

export const API_BASE_URL = resolveApiBaseUrl();

const DEBUG = import.meta.env.MODE === "development";

function formatValueForToast(value: unknown): string {
  if (value == null) return "Something went wrong";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) return o.message;
    if (typeof o.detail === "string") return o.detail;
    if (Array.isArray(o.detail)) {
      return o.detail
        .map((item) => formatValueForToast(item))
        .filter(Boolean)
        .join("; ");
    }
    if (o.errors != null) {
      try {
        return typeof o.errors === "string" ? o.errors : JSON.stringify(o.errors);
      } catch {
        return "Invalid request";
      }
    }
    try {
      return JSON.stringify(value);
    } catch {
      return "Invalid request";
    }
  }
  return String(value);
}

export const apiFetch = async (
  url: URL,
  options: RequestInit = {},
  auth: boolean = true
) => {
  try {
    if (auth) {
      const token = localStorage.getItem("x-auth-token");
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
      if (!isLocalAuthMode()) {
        clearStoredToken();
        toast.error("Session expired — sign in again");
      }
      return { error: "Unauthorized" };
    }

    return handleResponse(response, options, url);
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Fetch error" };
  }
};

const handleResponse = async (
  response: Response,
  options: RequestInit = {},
  url: URL = new URL("")
) => {
  if (response.status === 400) {
    const errorData = await response.json();
    const msg = formatValueForToast(
      errorData?.detail ?? errorData?.message ?? errorData?.error?.message ?? errorData
    );
    setTimeout(() => {
      toast.error(msg);
    }, 337);
    return { error: msg };
  }

  if (response.status === 403) {
    const errorData = await response.json();
    const msg = formatValueForToast(errorData?.message ?? errorData);
    toast.error(msg);
    return { error: "Forbidden" };
  }

  if (response.status === 409) {
    try {
      const errorData = await response.json();
      const errorMessage = formatValueForToast(
        errorData.message ?? errorData.error ?? "Conflict error"
      );
      toast.error(errorMessage);
      return { error: errorMessage };
    } catch {
      const errorMessage = "Conflict error";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  }

  if (response.status === 422) {
    try {
      const errorData = await response.json();
      let errorMessage: string;
      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((error: { loc?: string[]; msg?: string }) => {
            const field = error.loc?.slice(1).join(".") || "field";
            return `${field}: ${error.msg}`;
          })
          .join("; ");
        toast.error(errorMessage);
      } else {
        errorMessage = JSON.stringify(errorData.detail, null, 2);
        toast.error(errorMessage);
      }
      return { error: errorMessage };
    } catch {
      const errorMessage = "Validation error";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  }

  if (response.status === 500) {
    toast.error("Internal server error");
    return { error: "Internal server error" };
  }

  if (!response.ok) {
    console.error("Response error:", response);
    return { error: "Request failed" };
  }

  if (response.status === 204) {
    if (DEBUG) {
      console.log(`Fetch (${options.method || "GET"}): ${url}`, { success: "OK" });
    }
    return { data: null };
  }

  const responseData = await response.json();
  const data = responseData?.data || responseData;

  if (DEBUG) {
    console.log(`Fetch (${options.method || "GET"}): ${url}`, { data });
  }

  return { data };
};
