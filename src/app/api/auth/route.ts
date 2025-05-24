import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../../../../prisma/prisma-client";

export async function GET() {
	try {
		// Получаем токен из куки
		const token = (await cookies()).get("token");

		if (!token) {
			return NextResponse.json(
				{
					authenticated: false,
				},
				{ status: 401 }
			);
		}
		// Проверяем валидность токена
		const decoded = verify(token.value, process.env.JWT_SECRET || "fallback-secret") as {
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
			return NextResponse.json(
				{
					authenticated: false,
				},
				{ status: 401 }
			);
		}
		return NextResponse.json({
			authenticated: true,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Auth check error:", error);
		return NextResponse.json(
			{
				authenticated: false,
				error: "Invalid token",
			},
			{ status: 401 }
		);
	}
}
