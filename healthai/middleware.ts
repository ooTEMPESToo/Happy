import { NextRequest, NextResponse } from "next/server";

// Publicly accessible routes
const publicRoutes = ["/", "/login", "/register"];

// Middleware function
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files, assets, or API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // ✅ If route is public (like /login or /register)
  if (publicRoutes.includes(pathname)) {
    // ⛔ If user is already logged in and tries to access login/register → redirect to dashboard
    if (token) {
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  // ✅ Protected route → no token? Redirect to login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ✅ Apply to all routes
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
