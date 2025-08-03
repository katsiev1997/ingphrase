import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../../prisma/prisma-client";
import { NextResponse } from "next/server";

export interface AuthenticatedUser {
	id: number;
	email: string;
	role: "ADMIN" | "MODERATOR" | "USER";
}

export interface AuthResult {
	success: boolean;
	user?: AuthenticatedUser;
	error?: string;
	statusCode?: number;
}

/**
 * Проверяет авторизацию пользователя
 */
export async function checkAuth(): Promise<AuthResult> {
	try {
		const token = (await cookies()).get("token");

		if (!token) {
			return {
				success: false,
				error: "Unauthorized",
				statusCode: 401,
			};
		}

		// Проверяем валидность токена
		const decoded = verify(
			token.value,
			process.env.JWT_SECRET || "fallback-secret"
		) as {
			userId: string;
		};

		// Получаем информацию о пользователе
		const user = await prisma.user.findUnique({
			where: { id: Number(decoded.userId) },
			select: {
				id: true,
				email: true,
				role: true,
			},
		});

		if (!user) {
			return {
				success: false,
				error: "User not found",
				statusCode: 401,
			};
		}

		return {
			success: true,
			user: user as AuthenticatedUser,
		};
	} catch (error) {
		console.error("Auth check error:", error);
		return {
			success: false,
			error: "Invalid token",
			statusCode: 401,
		};
	}
}

/**
 * Проверяет авторизацию и права доступа для модераторов и администраторов
 */
export async function checkModeratorAuth(): Promise<AuthResult> {
	const authResult = await checkAuth();

	if (!authResult.success) {
		return authResult;
	}

	const user = authResult.user!;

	// Проверяем права доступа (только MODERATOR и ADMIN)
	if (user.role !== "MODERATOR" && user.role !== "ADMIN") {
		return {
			success: false,
			error: "Insufficient permissions",
			statusCode: 403,
		};
	}

	return authResult;
}

/**
 * Проверяет авторизацию и права доступа для администраторов
 */
export async function checkAdminAuth(): Promise<AuthResult> {
	const authResult = await checkAuth();

	if (!authResult.success) {
		return authResult;
	}

	const user = authResult.user!;

	// Проверяем права доступа (только ADMIN)
	if (user.role !== "ADMIN") {
		return {
			success: false,
			error: "Insufficient permissions",
			statusCode: 403,
		};
	}

	return authResult;
}

/**
 * Создает JSON ответ с ошибкой авторизации
 */
export function createAuthErrorResponse(authResult: AuthResult) {
	return NextResponse.json(
		{ error: authResult.error },
		{ status: authResult.statusCode || 401 }
	);
}
