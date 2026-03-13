/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Client-side authentication error management
 * Simple state-based error handling for login form
 */

export interface AuthError {
  type: "default" | "success" | "error" | "warning";
  title: string;
  message: string;
}

export interface ApiErrorResponse {
  /** General description (shown as message/description in UI) */
  message: string;
  /** Specific error reason (shown as title in UI) */
  error?: string;
  statusCode?: number;
}

/**
 * Parse API error response for authentication errors.
 * Uses API's `error` field as title and `message` field as description when both present.
 */
export const parseApiError = (error: unknown): AuthError => {
  const err = error as Record<string, unknown> | string | null | undefined;
  // Handle AxiosError or API response
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response: { data?: ApiErrorResponse } }).response;
    if (res?.data) {
      const apiError = res.data;
      return parseAuthError(
        apiError.message,
        apiError.statusCode,
        apiError.error,
      );
    }
  }

  // Handle direct error object (e.g. from auth-service: { message, error?, statusCode })
  if (
    err &&
    typeof err === "object" &&
    (err.message != null || err.error != null)
  ) {
    const description = (err.message ?? err.error) as string;
    const title = (err.error ?? err.message) as string;
    return {
      type: "error",
      title: typeof title === "string" ? title : "Login Failed",
      message:
        typeof description === "string"
          ? description
          : "An unexpected error occurred.",
    };
  }

  // Handle string errors
  const errorMessage =
    typeof err === "string" ? err : (err?.message as string) || "Unknown error";
  const status =
    typeof err === "object" && err != null
      ? ((err.status as number) ?? (err.statusCode as number))
      : 0;
  return parseAuthError(errorMessage, status ?? 0);
};

/**
 * Parse server error response and return user-friendly error message.
 * @param message - Description text (API "message" field)
 * @param statusCode - Optional HTTP status
 * @param title - Optional title (API "error" field); used as message title when provided
 */
export function parseAuthError(
  message: string,
  statusCode?: number,
  title?: string,
): AuthError {
  // When API provides both title (error) and message, use them directly
  if (title && message) {
    return {
      type: "error",
      title,
      message,
    };
  }

  // Try to parse as structured error (e.g. NextAuth JSON string)
  try {
    const structuredError = JSON.parse(message);
    if (structuredError.title && structuredError.message) {
      return {
        title: structuredError.title,
        message: structuredError.message,
        type: structuredError.type || "error",
      };
    }
  } catch {
    // Not a structured error, continue with regular parsing
  }

  // Handle different error scenarios (when no title was provided)
  switch (statusCode) {
    case 401:
      return {
        type: "error",
        title: title ?? "Invalid Credentials",
        message:
          message ||
          "The email or password you entered is incorrect. Please try again.",
      };
    case 404:
      return {
        type: "error",
        title: title ?? "Service Unavailable",
        message:
          "Authentication service is currently unavailable. Please contact support.",
      };
    case 500:
      return {
        type: "error",
        title: title ?? "Server Error",
        message:
          "Unable to connect to the server. Please check your internet connection.",
      };
    case 501:
      return {
        type: "error",
        title: title ?? "Connection Error",
        message:
          "Unable to connect to the server. Please check your internet connection.",
      };
    default:
      return {
        type: "error",
        title: title ?? "Login Failed",
        message:
          message ||
          "An unexpected error occurred during login. Please try again.",
      };
  }
}
