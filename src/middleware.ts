import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Маршруты, которые требуют авторизации
const protectedRoutes = ["/favorites"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("token");

	// Если пользователь не авторизован и пытается получить доступ к защищенным маршрутам
	if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// Если пользователь авторизован и пытается получить доступ к странице входа
	// Убираем редирект, чтобы пользователи могли видеть страницу входа
	// if (token && pathname === "/auth/login") {
	// 	return NextResponse.redirect(new URL("/", request.url));
	// }

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
