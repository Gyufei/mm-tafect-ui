export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/(.*)",
    "/key-store",
    "/key-store/(.*)",
    "/token-swap",
    "/token-swap/(.*)",
    "/setting",
    "/setting/(.*)",
  ],
};
