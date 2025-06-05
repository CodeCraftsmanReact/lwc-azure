import NextAuth from "next-auth";
import "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";
import Google from "next-auth/providers/google";
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import { UnstorageAdapter } from "@auth/unstorage-adapter";

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  providers: [AzureADProvider, Google],
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update") token.name = session.user.name;
      if (user?.email) {
        const role = await fetch(
          `${process.env.VERCEL_URL}/api/getRolesForUsers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({ claims: { email: user.email } }),
          }
        );
        token.role = role ?? "anonymous";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken;
      session.user.role = token?.role || "anonymous";
      return session;
    },
  },
  experimental: { enableWebAuthn: true },
});
