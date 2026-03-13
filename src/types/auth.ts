import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

export type UserRoleItem = unknown;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: UserRoleItem[];
      role?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
  }

  interface User extends DefaultUser {
    roles: UserRoleItem[];
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    roles?: UserRoleItem[];
    id: string;
    name?: string | null;
    email?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}

/** Normalized login result used by NextAuth (auth.ts) */
export interface ILogin {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IUser {
  id: string;
  email: string;
  roles: UserRoleItem[];
  role?: string;
  name?: string;
  profile?: Profile | null;
  organization?: IOrganization | null;
  branch?: IBranch | null;
}

/** API login success response */
export interface ILoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
  timestamp: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ILoginErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

export interface Profile {
  id?: number;
  name?: string;
  mobile?: string | null;
  image_path?: string | null;
  is_active?: boolean;
  created_on?: string | Date;
  updated_on?: string | Date;
  role?: string;
}

export interface IOrganization {
  id: number;
  name: string;
}
export interface IBranch {
  id: number;
  name: string;
}


