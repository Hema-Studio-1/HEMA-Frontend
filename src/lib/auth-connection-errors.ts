import axios from "axios";

export type DeploymentCheckResult = {
  configured: {
    nextAuthSecret: boolean;
    apiUrl: boolean;
    nextAuthUrl: boolean;
  };
  apiProbe: {
    reachable: boolean;
    httpStatus: number | null;
    errorCode: string | null;
    detail: string | null;
  };
  hints: string[];
};

const NETWORK_CODE_HINTS: Record<string, string> = {
  ECONNREFUSED:
    "Connection refused — the host is not accepting connections on that port, or the API is down.",
  ENOTFOUND:
    "DNS lookup failed — check API_URL for typos and that the hostname exists.",
  ETIMEDOUT:
    "Request timed out — firewall, wrong IP/port, or the API is not reachable from Vercel/Netlify.",
  EAI_AGAIN: "Temporary DNS failure — retry later or verify DNS for the API host.",
  ERR_NETWORK:
    "Network error before any HTTP response (blocked, offline, or TLS issue).",
  CERT_HAS_EXPIRED: "TLS certificate error when calling the API.",
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: "TLS verification failed for the API endpoint.",
};

/**
 * Classify axios errors from server-side calls to the backend API.
 */
export function classifyAxiosApiFailure(error: unknown): {
  title: string;
  message: string;
  connectionCode?: string;
} {
  if (!axios.isAxiosError(error)) {
    const msg = error instanceof Error ? error.message : "Unexpected error";
    return { title: "Request failed", message: msg };
  }

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as { message?: string } | undefined;
    const apiMsg =
      typeof data?.message === "string"
        ? data.message
        : error.response.statusText || error.message;
    return {
      title: `API returned HTTP ${status}`,
      message: apiMsg,
    };
  }

  const code = error.code ?? "ERR_NETWORK";
  const hint = NETWORK_CODE_HINTS[code] ?? error.message;
  return {
    title: "Cannot reach authentication API",
    message: `${hint} (${code})`,
    connectionCode: code,
  };
}

export function summarizeDeploymentCheck(data: DeploymentCheckResult): {
  title: string;
  message: string;
  detail: string;
} {
  const lines: string[] = [...data.hints];

  if (!data.configured.nextAuthSecret) {
    lines.push("Set NEXTAUTH_SECRET in your host’s environment variables.");
  }
  if (!data.configured.apiUrl) {
    lines.push(
      "Set NEXT_PUBLIC_API_URL  to your backend base URL.",
    );
  }
  if (!data.configured.nextAuthUrl) {
    lines.push(
      "Set NEXTAUTH_URL to your live site origin (e.g. https://your-app.vercel.app).",
    );
  }

  if (data.apiProbe.reachable) {
    lines.push(
      data.apiProbe.httpStatus != null
        ? `Auth login endpoint responded with HTTP ${data.apiProbe.httpStatus}.`
        : "Auth login endpoint is reachable.",
    );
  } else {
    const extra = data.apiProbe.detail
      ? ` ${data.apiProbe.detail}`
      : data.apiProbe.errorCode
        ? ` (${data.apiProbe.errorCode})`
        : "";
    lines.push(
      `The server could not reach the backend API.${extra} Check API_URL, firewalls, and that the API allows your hosting region.`,
    );
  }

  const title = !data.apiProbe.reachable
    ? "Backend API unreachable from hosting"
    : !data.configured.nextAuthSecret || !data.configured.apiUrl
      ? "Authentication configuration issue"
      : "Session / authentication diagnostic";

  return {
    title,
    message: lines[0] ?? "See technical details below for full checks.",
    detail: lines.join("\n\n"),
  };
}
