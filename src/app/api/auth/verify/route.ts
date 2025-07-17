import { NextResponse } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../../../../../prisma/prisma-client";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const token = searchParams.get("token");

		if (!token) {
			return NextResponse.json({ error: "Token is required" }, { status: 400 });
		}

		// Проверяем Magic Link токен
		const decoded = verify(
			token,
			process.env.JWT_SECRET || "fallback-secret"
		) as {
			userId: string;
			email: string;
			type: string;
		};

		// Проверяем, что это Magic Link токен
		if (decoded.type !== "magic-link") {
			return NextResponse.json(
				{ error: "Invalid token type" },
				{ status: 400 }
			);
		}

		// Получаем пользователя
		const user = await prisma.user.findUnique({
			where: { id: Number(decoded.userId) },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Создаем постоянный сессионный токен
		const sessionToken = sign(
			{ userId: user.id },
			process.env.JWT_SECRET || "fallback-secret",
			{ expiresIn: "14d" }
		);

		// Устанавливаем куки с сессионным токеном
		(await cookies()).set("token", sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 14, // 14 дней
		});

		// Возвращаем успешный ответ
		return NextResponse.json({
			success: true,
			message: "Authentication successful",
		});
	} catch (error) {
		console.error("Verify error:", error);
		return NextResponse.json(
			{ error: "Invalid or expired token" },
			{ status: 400 }
		);
	}
}
