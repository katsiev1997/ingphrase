import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../../../prisma/prisma-client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

		// Создаем временный токен для Magic Link (действует 15 минут)
		const magicToken = sign(
			{
				userId: user.id,
				email: user.email,
				type: "magic-link",
			},
			process.env.JWT_SECRET || "fallback-secret",
			{ expiresIn: "15m" }
		);

		// Создаем Magic Link
		const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${magicToken}`;

		// Отправляем email с Magic Link
		const { error } = await resend.emails.send({
			from: "onboarding@resend.dev", // Тестовый домен Resend
			to: email,
			subject: "Вход в приложение",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Добро пожаловать!</h2>
					<p>Для входа в приложение перейдите по ссылке ниже:</p>
					<a href="${magicLink}" 
					   style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
						Войти в приложение
					</a>
					<p style="color: #666; font-size: 14px;">
						Эта ссылка действительна в течение 15 минут. Если вы не запрашивали вход, проигнорируйте это письмо.
					</p>
				</div>
			`,
		});

		if (error) {
			console.error("Email sending error:", error);
			return NextResponse.json(
				{ error: "Failed to send email" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Magic link sent to your email",
		});
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
