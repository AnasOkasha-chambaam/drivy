// Create a types/next-auth.d.ts file in your project

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

interface IAuthUser extends DefaultUser {
  id: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  organizationId?: string;
}

declare module "next-auth" {
  interface User extends IAuthUser {}

  interface Session {
    user: IAuthUser;
  }
}

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    avatar?: string;
    role?: string;
    permissions?: string[];
    organizationId?: string;
  }
}
