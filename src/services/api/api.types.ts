/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig } from "axios";

type SuccessMessageFunction<T> = (data: T) => string;
interface FetchOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  params?: AxiosRequestConfig["params"];
  successMessage?: string | SuccessMessageFunction<T>;
  errorMessage?: string;
  silent?: boolean;
  isTestNet?: boolean;
  signal?: AbortSignal;
  skipAuth?: boolean; // Skip authentication for login/public endpoints
}
interface FetchResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  validationErrors?: Record<string, string>;
}
interface ApiError {
  message: string | string[];
}

export type { ApiError, FetchOptions, FetchResponse, SuccessMessageFunction };

