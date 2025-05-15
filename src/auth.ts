import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

// Mock user database
const users = [
  {
    id: "1",
    name: "Peter",
    email: "peter@example.com",
    password: "password123", // In a real app, this would be hashed
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }) {
        const user = users.find((user) => user.email === email);
        
        // Check if user exists and password matches
        if (user && user.password === password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        
        // Authentication failed
        return null;
      },
    }),
  ],
});