import type { DeploymentCheckResult } from "@/lib/auth-connection-errors";
import { ENV_VARIABLES } from "@/lib/env-variables";
import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Read-only diagnostics for production (Vercel/Netlify): env presence + server → API reachability.
 * Does not expose secrets or real credentials.
 */
export async function GET() {
  const configured = {
    nextAuthSecret: ENV_VARIABLES.NEXTAUTH_SECRET.length > 0,
    apiUrl: ENV_VARIABLES.API_URL.length > 0,
    nextAuthUrl: ENV_VARIABLES.NEXTAUTH_URL.length > 0,
  };

  const hints: string[] = [];
  if (!configured.nextAuthSecret) {
    hints.push(
      "NEXTAUTH_SECRET is missing — session encryption will fail; set it in your host environment.",
    );
  }
  if (!configured.apiUrl) {
    hints.push(
      "API base URL is missing — set NEXT_PUBLIC_API_URL (or API_URL on the server).",
    );
  }
  if (!configured.nextAuthUrl) {
    hints.push(
      "NEXTAUTH_URL is missing — set it to your live site URL (e.g. https://your-app.vercel.app).",
    );
  }

  let reachable = false;
  let httpStatus: number | null = null;
  let errorCode: string | null = null;
  let detail: string | null = null;

  if (configured.apiUrl) {
    const base = ENV_VARIABLES.API_URL.replace(/\/$/, "");
    try {
      console.log("base", base);
      const res = await axios.post(
        `${base}/auth/login`,
        {
          email: "dacara3174@daerdy.com",
          password: "pass@1234",
          twoFactorToken: "",
        },
        {
          timeout: 12_000,
          validateStatus: () => true,
        },
      );
      httpStatus = res.status;
      reachable = true;
      if (res.status >= 500) {
        detail = `Login endpoint returned HTTP ${res.status} — the API may be erroring.`;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          reachable = true;
          httpStatus = e.response.status;
        } else {
          errorCode = e.code ?? "ERR_NETWORK";
          detail = e.message;
        }
      } else {
        detail = e instanceof Error ? e.message : String(e);
      }
    }
  }

  const body: DeploymentCheckResult = {
    configured,
    apiProbe: { reachable, httpStatus, errorCode, detail },
    hints,
  };

  return NextResponse.json(body);
}
