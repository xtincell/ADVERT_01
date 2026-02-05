import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient, type UserRole } from "../../../generated/prisma";

// Create a separate Prisma client for auth (without tenant RLS)
// Auth operations need to query users across all tenants for login
const prisma = new PrismaClient();

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      tenantId: string;
      role: UserRole;
    };
  }

  interface User {
    tenantId?: string;
    role?: UserRole;
  }

  interface JWT {
    id?: string;
    tenantId?: string;
    role?: UserRole;
  }
}

/**
 * NextAuth.js v5 Configuration
 *
 * Features:
 * - Credentials provider for email/password auth
 * - Prisma adapter for user/session storage
 * - JWT session strategy with tenant context
 * - Custom pages configuration
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  adapter: PrismaAdapter(prisma),

  // Use JWT for sessions (better performance for MVP)
  session: {
    strategy: "jwt",
    maxAge: 86400, // 24 hours
  },

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/logout",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            tenantId: true,
            role: true,
            image: true,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
          return null;
        }

        // Return user object (without passwordHash)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tenantId: user.tenantId,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback - adds user data to token
     * Called whenever a JWT is created or updated
     */
    jwt({ token, user }) {
      // On initial sign in, add user data to token
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.role = user.role;
      }
      return token;
    },

    /**
     * Session callback - exposes token data to client
     * Called whenever session is accessed
     */
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.tenantId = token.tenantId as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
