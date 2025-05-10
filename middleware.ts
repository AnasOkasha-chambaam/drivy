import { auth } from "@/auth";

const PUBLIC_ROUTES = ["/", "/login"] as const;

export default auth((req) => {
  if (
    !req.auth &&
    !PUBLIC_ROUTES.includes(
      req.nextUrl.pathname as (typeof PUBLIC_ROUTES)[number]
    )
  ) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes except auth routes
    "/(api(?!/auth))(.*)",

    // Run for trpc routes
    "/trpc(.*)",
  ],
};
