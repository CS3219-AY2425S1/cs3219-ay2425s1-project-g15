import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIsAdmin, verifyToken } from "@/api/user";
import { checkUserInSession } from "./api/collaboration";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isTokenValid = token ? await verifyToken(token) : false;
  if (!isTokenValid && request.nextUrl.pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isTokenValid && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (request.nextUrl.pathname === '/login' && isTokenValid) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isAdmin = getIsAdmin();
  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  // If user collab id is not in the session, redirect to the dashboard
  if (request.nextUrl.pathname.startsWith('/collaboration')) {
    const sessionId = request.nextUrl.pathname.split('/')[2];
    const userId = request.cookies.get("id")?.value || "";
    const username = request.cookies.get("username")?.value || "";
    const isUserInSession = await checkUserInSession(sessionId, userId, username);
    if (!isUserInSession.exists) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/dashboard', '/user/me', '/match', '/collaboration/:id*'],
  unstable_allowDynamic: [
    '/node_modules/sweetalert2/**',
  ],
}