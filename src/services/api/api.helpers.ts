/* eslint-disable @typescript-eslint/no-explicit-any */

import { ENV_VARIABLES } from "@/lib/env-variables";
import type { SuccessMessageFunction } from "@/services/api/api.types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
// import { getCachedAccessToken } from "./token-cache";

/**
 * Get current authentication token (cache first, then session)
 */
export const getAuthToken = async (): Promise<string | null> => {
  // const cached = getCachedAccessToken();
  // if (cached) return cached;
  try {
    if (ENV_VARIABLES.FORCE_ACCESS_TOKEN) {
      return ENV_VARIABLES.FORCE_ACCESS_TOKEN;
    }
    if (typeof window !== "undefined") {
      const session = await getSession();
      return session?.accessToken || ENV_VARIABLES.FORCE_ACCESS_TOKEN || null;
    }
    return null;
  } catch (error) {
    console.warn("Failed to get auth token:", error);
    return null;
  }
};

export function handleSuccess<T>(
  data: T,
  successMessage: string | SuccessMessageFunction<T>,
  silent: boolean,
) {
  let messageToShow: string = "Success";
  if (typeof successMessage === "function") {
    messageToShow = successMessage(data);
  } else if (successMessage !== "Success") {
    messageToShow = successMessage;
  } else if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    messageToShow = data.message;
  }

  if (!silent) toast.success(messageToShow);
}

export function getErrorMessage(error: unknown): string {
  // Axios error
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return (
        error.response.data?.message || `Server Error: ${error.response.status}`
      );
    } else if (error.request) {
      return `Network Error: No response from server`;
    } else {
      return `Request Error: ${error.message}`;
    }
  }

  // AggregateError
  if (error instanceof AggregateError && error.errors.length > 0) {
    return getErrorMessage(error.errors[0]);
  }

  // Nested cause
  if (error && typeof error === "object" && "cause" in error) {
    return getErrorMessage((error as any).cause);
  }

  // Network error codes
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as any).code;
    if (code === "ECONNREFUSED")
      return "Network Error: Connection refused by server";
    if (code === "ECONNABORTED") return "Network Error: Request timed out";
  }

  // Fallback
  if (error instanceof Error) return error.message;

  return "An unknown error occurred";
}

type RefinedError = {
  message: string;
  status: number;
};

export function getRefinedError(error: unknown): RefinedError {
  // Axios error with server response
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        message:
          error.response.data?.message ||
          `Server Error: ${error.response.status}`,
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        message: "Network Error: No response from server",
        status: 500,
      };
    } else {
      return {
        message: `Request Error: ${error.message}`,
        status: 501,
      };
    }
  }

  // AggregateError (Node 18+)
  if (error instanceof AggregateError && error.errors?.length) {
    return getRefinedError(error.errors[0]);
  }

  // Nested cause
  if (error && typeof error === "object" && "cause" in error) {
    return getRefinedError((error as any).cause);
  }

  // Network-level error codes
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as any).code;
    if (code === "ECONNREFUSED")
      return {
        message: "Network Error: Connection refused by server",
        status: 500,
      };
    if (code === "ECONNABORTED")
      return {
        message: "Network Error: Request timed out",
        status: 500,
      };
  }

  // Generic Error
  if (error instanceof Error) {
    return { message: error.message, status: 501 };
  }

  // Fallback
  return { message: "An unknown error occurred", status: 501 };
}
