import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = ["/admin", "/admin/*"];
const requiredRole = "admin";

export async function middleware(req) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  const url = req.nextUrl.pathname;

  // Check if this is a protected route
  if (protectedRoutes.some((route) => url.startsWith(route))) {
    if (token.role !== requiredRole) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Protect any /admin/* routes
};
