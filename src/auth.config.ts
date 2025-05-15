import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      
      // Allow access to login page when not logged in
      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }
      
      // Redirect to login if accessing protected routes while not logged in
      if (!isLoggedIn && isOnDashboard) {
        return false; // Will redirect to login
      }
      
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  providers: [], // Providers are defined in auth.ts
  secret: process.env.AUTH_SECRET || "your-secret-key-for-development-only",
} satisfies NextAuthConfig;