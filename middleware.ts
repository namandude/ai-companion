// import { authMiddleware } from "@clerk/nextjs";
// export default authMiddleware({});
// export const config = {
//   matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
// import { authMiddleware } from "@clerk/nextjs";
import { authMiddleware } from "@clerk/nextjs/server";
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Exclude static files and _next chunks
    "/", // Root route
    "/(api|trpc)(.*)" // API and trpc routes
  ],
};

export default authMiddleware({});

// Remove the config object or place it appropriately in your Next.js application configuration.
