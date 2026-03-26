import { parseApiError } from "@/lib/auth-client-errors";
import { ENV_VARIABLES } from "@/lib/env-variables";
import type { User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginUser } from "@/services/auth/auth-service";
// Refresh API not available yet - uncomment when ready:
// import { isTokenExpiringSoon, refreshUserTokens } from "@/services/auth/auth-service";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await loginUser({
            email: credentials.email,
            password: credentials.password,
          });

          if (!result.success) {
            const authError = parseApiError(result.error);
            throw new Error(
              JSON.stringify({
                title: authError.title,
                message: authError.message,
                type: authError.type,
                statusCode: result.error?.statusCode,
                code: result.error?.code,
              }),
            );
          }

          const { user, accessToken, refreshToken } = result.data!;
          const firstRole = Array.isArray(user.roles)
            ? user.roles[0]
            : undefined;
          const firstRoleAsRecord =
            firstRole && typeof firstRole === "object"
              ? (firstRole as Record<string, unknown>)
              : null;
          const normalizedRole =
            typeof firstRole === "string"
              ? firstRole
              : typeof firstRoleAsRecord?.name === "string"
                ? firstRoleAsRecord.name
                : "";
          const profileAsRecord =
            user.profile && typeof user.profile === "object"
              ? (user.profile as Record<string, unknown>)
              : null;
          const profileName =
            typeof profileAsRecord?.name === "string"
              ? profileAsRecord.name
              : undefined;
          const displayName =
            profileName ??
            (typeof user.name === "string" ? user.name : undefined);

          const userReturn = {
            id: user.id.toString(),
            email: user.email,
            name: displayName,
            roles: user.roles,
            role: user.role ?? normalizedRole,
            profile: user?.profile ?? undefined,
            organization: user?.organization ?? null,
            branch: user?.branch ?? null,
            accessToken,
            refreshToken,
          } as unknown as User & Record<string, unknown>;
          return userReturn;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  pages: {
    // MVP: keep all auth outcomes on home page.
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Initial sign in
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.profile = user.profile;
        token.organization = user.organization ?? null;
        token.branch = user.branch ?? null;
      }

      // Refresh token scenario - API not available yet; uncomment when ready
      // if (
      //   token.accessToken &&
      //   isTokenExpiringSoon(token.accessToken, 5 * 60 * 1000)
      // ) {
      //   try {
      //     const refreshResult = await refreshUserTokens(token.refreshToken);
      //     if (refreshResult.success) {
      //       token.accessToken = refreshResult.data!.accessToken;
      //       token.refreshToken = refreshResult.data!.refreshToken;
      //     } else {
      //       return {};
      //     }
      //   } catch {
      //     return {};
      //   }
      // }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // ensure base fields also align
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        // attach rich profile and organization for tenant context
        session.user.profile = token.profile ?? session.user.profile;
        session.user.organization = token.organization ?? null;
        session.user.branch = token.branch ?? null;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // MVP: redirect to home page after successful login
      if (url === "/" || url === baseUrl || url.startsWith(`${baseUrl}/`)) {
        return `${baseUrl}/`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  // cookies: {
  //   sessionToken: {
  //     name: 'admin_app_session',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: ENV_VARIABLES.NODE_ENV === 'production',
  //     },
  //   },
  // },
  secret: ENV_VARIABLES.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
