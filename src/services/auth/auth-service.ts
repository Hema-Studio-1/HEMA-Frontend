import { ENV_VARIABLES } from "@/lib/env-variables";
import { $serverFetch } from "@/services/api/api-service";
import type {
    ILoginErrorResponse,
    ILoginResponse,
    IUser,
} from "@/types/auth";

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roles: unknown[];
  name?: string;
  role?: string;
  profile?: unknown;
  organization?: unknown | null;
  branch?: unknown | null;
}

export interface LoginSuccessData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  success: true;
  data: LoginSuccessData;
}

export interface LoginErrorResult {
  success: false;
  error?: {
    message?: string;
    error?: string;
    statusCode?: number;
    /** Axios / Node network code when status is 0 */
    code?: string;
  };
}

export type LoginResponse = LoginResult | LoginErrorResult;

/**
 * Call the backend auth/login API.
 * Uses ENV_VARIABLES.API_URL for the base URL.
 */
export async function loginUser(
  payload: LoginUserPayload
): Promise<LoginResponse> {
  try {
    const response = await $serverFetch<ILoginResponse>({
      url: "/auth/login",
      method: "POST",
      data: {
        email: payload.email,
        password: payload.password,
        twoFactorToken:''
      },
    });
    const apiResponse = response.data;
    if (!apiResponse || response.status < 200 || response.status >= 300) {
      return {
        success: false,
        error: {
          message: response.error ?? "Login failed",
          error: response.meta?.errorTitle,
          statusCode: response.status,
          code: response.meta?.connectionCode,
        },
      };
    }
    const apiData = apiResponse.data;
    const user = apiData?.user as IUser | undefined;
    const accessToken = apiData?.accessToken;
    const refreshToken = apiData?.refreshToken;

    if (!apiResponse?.success || !user || !accessToken || !refreshToken) {
      return {
        success: false,
        error: {
          message: apiResponse?.message || "Invalid login response",
          statusCode: 500,
        },
      };
    }

    return {
      success: true,
      data: {
        user: {
          id: String(user.id),
          email: String(user.email),
          roles: Array.isArray(user.roles) ? user.roles : [],
          name: user.name,
          role: user.role,
          profile: user.profile,
          organization: user.organization,
          branch: user.branch,
        },
        accessToken: String(accessToken),
        refreshToken: String(refreshToken),
      },
    };
  } catch (err) {
    const apiError = err as ILoginErrorResponse | Error;
    const message =
      apiError instanceof Error
        ? apiError.message
        : apiError.message || "Failed to connect to auth service";
    return {
      success: false,
      error: {
        message,
        statusCode: 0,
        error: "Unexpected login error",
      },
    };
  }
}
