export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/(.*)",
    "/keyStore",
    "/keyStore/(.*)",
    "/tokenSwap",
    "/tokenSwap/(.*)",
  ],
};
