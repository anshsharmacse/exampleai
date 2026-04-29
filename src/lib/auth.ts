import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const action = credentials.action || "login";

        if (action === "register") {
          // Register new user
          if (!credentials.password || !credentials.name) return null;

          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (existingUser) return null;

          const hashedPassword = await bcrypt.hash(credentials.password, 12);
          const user = await db.user.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              password: hashedPassword,
              plan: "free",
              credits: 0,
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }

        // Login
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || undefined;
        token.name = user.name || undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) || "";
        session.user.name = (token.name as string) || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
