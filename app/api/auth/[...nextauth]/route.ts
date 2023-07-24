import { Path } from "@/lib/path";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "",
      credentials: {},
      async authorize(credentials, req) {
        return {
          name: "Xiaoming",
          email: "1123123@qq.com",
          avatar: "https://avatars.githubusercontent.com/u/1396951?v=4",
        };

        const res = await fetch("/your/endpoint", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
