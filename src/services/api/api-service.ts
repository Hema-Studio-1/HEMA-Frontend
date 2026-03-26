/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: API wrapper handles heterogeneous error shapes */

import { classifyAxiosApiFailure } from "@/lib/auth-connection-errors";
import { ENV_VARIABLES } from "@/lib/env-variables";
import {
  getAuthToken,
  getRefinedError,
  handleSuccess,
} from "@/services/api/api.helpers";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import type { FetchOptions, FetchResponse } from "./api.types";

// Extend AxiosRequestConfig to include retry flag
interface ExtendedAxiosConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
// Request queue for handling concurrent requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const BASE_URL = ENV_VARIABLES.API_URL;

const MAX_RETRIES = 2;
const RETRY_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes
const retryCooldownMap = new Map<string, number>();

function getRetryKey(method: string, url: string): string {
  return `${method}:${url}`;
}

function isInCooldown(key: string): boolean {
  const until = retryCooldownMap.get(key);
  if (!until || typeof window === "undefined") return false;
  if (Date.now() < until) return true;
  retryCooldownMap.delete(key);
  return false;
}

function setCooldown(key: string): void {
  if (typeof window === "undefined") return;
  retryCooldownMap.set(key, Date.now() + RETRY_COOLDOWN_MS);
}

async function waitForSessionAccessToken(
  timeoutMs = 5000,
  pollIntervalMs = 200,
): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const start = Date.now();
  while (Date.now() - start <= timeoutMs) {
    const session = await getSession();
    if (session?.accessToken) {
      return session.accessToken;
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return null;
}

/** Clear retry cooldown for manual retries (e.g. user clicked Retry button) */
export function clearRetryCooldown(method = "GET", url: string): void {
  retryCooldownMap.delete(getRetryKey(method, url));
}

function shouldRetry(error: unknown, attempt: number): boolean {
  if (attempt >= MAX_RETRIES) return false;
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) return false;
    if (status && status >= 400 && status < 500 && status !== 429) return false;
  }
  return true;
}

export async function $axiosReq<T = any>({
  url,
  method = "GET",
  data = null,
  headers = {},
  params = {},
  successMessage = "Success",
  silent = false,
  signal,
  skipAuth = false, // New parameter to skip authentication for login calls
}: FetchOptions<T>): Promise<FetchResponse<T>> {
  const toastId = !silent ? toast.loading("Loading...") : null;
  const retryKey = getRetryKey(method, url);

  // Skip retries for auth endpoints
  const enableRetry = !skipAuth;

  if (!skipAuth) {
    const accessToken = await waitForSessionAccessToken();
    if (!accessToken) {
      if (!silent && toastId !== null) toast.dismiss(toastId);
      return {
        data: null,
        error: "No active session. Sign in to continue.",
        status: 401,
      };
    }
  }

  if (enableRetry && isInCooldown(retryKey)) {
    if (!silent && toastId !== null) toast.dismiss(toastId);
    return {
      data: null,
      error: "Service temporarily unavailable. Please try again later.",
      status: 503,
    };
  }

  let lastError: unknown = null;
  let lastApiError: { message: string; status: number } | null = null;

  for (let attempt = 0; attempt <= (enableRetry ? MAX_RETRIES : 0); attempt++) {
    try {
      // Get authentication token only if not skipping auth
      const authToken = !skipAuth ? await getAuthToken() : null;

      const axiosConfig: ExtendedAxiosConfig = {
        baseURL: BASE_URL,
        url,
        method,
        params,
        data: { ...data },
        headers: {
          "Content-Type": "application/json",
          ...headers,
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        signal,
      };

      // Skip token refresh mechanism for auth endpoints
      const response = skipAuth
        ? await axios.request<T>(axiosConfig)
        : await makeAuthenticatedRequest<T>(axiosConfig);

      // Check if response body contains statusCode: 401 (API returns error in body with 200 status)
      if (
        response.data &&
        typeof response.data === "object" &&
        "statusCode" in response.data &&
        (response.data as any).statusCode === 401
      ) {
        // Try refresh before redirecting (once per request)
        // if (!hasRetriedBody401) {
        //   const refreshed = await tryRefreshForBody401();
        //   if (refreshed) {
        //     hasRetriedBody401 = true;
        //     attempt--;
        //     continue;
        //   }
        // }
        try {
          await signOut({ redirect: false });
        } finally {
          redirectToSignIn();
        }
        const apiError = getRefinedError(response.data);
        return {
          data: null,
          error: apiError.message,
          status: 401,
        };
      }

      if (!silent && toastId !== null) toast.dismiss(toastId);

      handleSuccess<T>(response.data, successMessage, silent);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      lastError = error;
      lastApiError = {
        message: getRefinedError(error).message,
        status: getRefinedError(error).status,
      };

      if (!enableRetry || !shouldRetry(error, attempt)) {
        break;
      }

      // Brief delay before retry (exponential backoff: 1s, 2s, 4s)
      const delayMs = Math.min(1000 * 2 ** attempt, 4000);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  if (!silent && toastId !== null) toast.dismiss(toastId);

  if (enableRetry && lastError) {
    setCooldown(retryKey);
  }

  return {
    data: null,
    error: lastApiError?.message ?? "Request failed",
    status: lastApiError?.status ?? 0,
  };
}

export async function $serverFetch<T = any>({
  url,
  method = "GET",
  data,
  params = {},
  headers = {},
}: FetchOptions<T>): Promise<FetchResponse<T>> {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const axiosConfig: AxiosRequestConfig = {
    baseURL: ENV_VARIABLES.API_URL,
    url,
    method,
    headers: defaultHeaders,
    data,
    params,
  };

  try {
    const response: AxiosResponse<T> = await axios(axiosConfig);

    if (!response.status.toString().startsWith("2")) {
      const textResponse = response.statusText;
      const errorMessage = `Error: ${textResponse || response.statusText}`;
      return { data: null, error: errorMessage, status: response.status };
    }

    try {
      const data: T = response.data;
      return { data, error: null, status: response.status };
    } catch {
      const rawText = response.statusText;
      return {
        data: null,
        error: `Invalid JSON response: ${rawText}`,
        status: response.status,
      };
    }
  } catch (error) {
    const c = classifyAxiosApiFailure(error);
    return {
      data: null,
      error: c.message,
      status: 0,
      meta: {
        errorTitle: c.title,
        connectionCode: c.connectionCode,
      },
    };
  }
}

/** Try refresh when API returned 200 with statusCode 401 in body. Returns true if refresh succeeded. */
// async function tryRefreshForBody401(): Promise<boolean> {
//   if (typeof window === "undefined") return false;
//   try {
//     const session = await getSession();
//     const refreshToken =
//       getCachedRefreshToken() ?? session?.refreshToken ?? null;
//     if (!refreshToken) return false;

//     const result = await refreshUserTokens(refreshToken);
//     if (!result.success || !result.data) return false;

//     setTokenCache(result.data.accessToken, result.data.refreshToken);
//     return true;
//   } catch {
//     return false;
//   }
// }

/** Build sign-in URL with callbackUrl for redirect-after-login */
function getSignInUrlWithCallback(): string {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname + window.location.search;
  if (!path || path === "/" || path.startsWith("/auth/")) {
    return "/";
  }
  return `/?callbackUrl=${encodeURIComponent(path)}`;
}

/** Force redirect to sign-in - runs even if signOut throws */
function redirectToSignIn(): void {
  if (typeof window !== "undefined") {
    const url = getSignInUrlWithCallback();
    window.location.replace(url);
  }
}

/**
 * Make authenticated request with automatic token refresh.
 * On 401: always try refresh first, only sign out and redirect when refresh fails.
 */
const makeAuthenticatedRequest = async <T>(
  config: ExtendedAxiosConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axios.request<T>(config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return await handleTokenRefresh<T>(config);
    }
    throw error;
  }
};

/**
 * Handle token refresh and retry original request
 */
const handleTokenRefresh = async <T>(
  originalConfig: ExtendedAxiosConfig,
): Promise<AxiosResponse<T>> => {
  if (originalConfig._retry) {
    // Already retried once, don't retry again
    throw new Error("Token refresh failed");
  }

  if (isRefreshing) {
    // Token refresh in progress, queue this request
    return new Promise<string | null>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((newToken) => {
      const updatedConfig = {
        ...originalConfig,
        _retry: true,
        headers: {
          ...originalConfig.headers,
          ...(newToken && {
            Authorization: `Bearer ${newToken}`,
          }),
        },
      };
      return axios.request<T>(updatedConfig);
    });
  }

  originalConfig._retry = true;
  isRefreshing = true;

  try {
    // Get current session to access refresh token - only on client side
    if (typeof window === "undefined") {
      // Server side - cannot refresh token, throw error to logout
      throw new Error("Token refresh not available on server side");
    }

    const session = await getSession();
    const refreshToken = session?.refreshToken ?? null;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const newAccessToken = session?.accessToken ?? null;

    originalConfig.headers = {
      ...originalConfig.headers,
      Authorization: `Bearer ${newAccessToken}`,
    };

    processQueue(null, newAccessToken);

    return await axios.request<T>(originalConfig);
  } catch (error) {
    processQueue(error, null);
    try {
      await signOut({ redirect: false });
    } finally {
      redirectToSignIn();
    }

    throw error;
  } finally {
    isRefreshing = false;
  }
};
