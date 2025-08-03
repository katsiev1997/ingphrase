import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../../../../../prisma/prisma-client";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Поиск существующего пользователя или создание нового
		let user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			user = await prisma.user.create({
				data: { email },
			});
		}

		// Создаем JWT токен для авторизации
		const token = sign(
			{
				userId: user.id,
				email: user.email,
			},
			process.env.JWT_SECRET || "fallback-secret",
			{ expiresIn: "14d" }
		);

		// Устанавливаем куки с токеном
		(await cookies()).set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 14, // 14 дней
		});

		return NextResponse.json({
			success: true,
			message: "Authentication successful",
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
