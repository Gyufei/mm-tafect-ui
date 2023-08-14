import { SystemEndPointPathMap } from "@/lib/end-point";
import { NextAuthOptions } from "next-auth";
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
        const res = await fetch(SystemEndPointPathMap.login, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (json && json.status) {
          const name = req?.body?.email.split("@")[0];

          return {
            id: String(Math.floor(Math.random() * 10000)),
            name: name,
            email: req?.body?.email,
            image: json?.data?.access_token,
          };
        }
        return null;
      },
    }),
  ],
};
