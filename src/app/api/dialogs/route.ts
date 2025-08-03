import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import type { NextRequest } from "next/server";
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from "../../../shared/lib/auth-utils";

// GET /api/dialogs
export async function GET() {
	try {
		const dialogues = await prisma.dialogue.findMany({
			include: {
				messages: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(dialogues);
	} catch (error) {
		console.error("Get dialogues error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST /api/dialogs
export async function POST(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем данные из запроса
		const { title, messages } = await req.json();

		// Валидация данных
		if (
			!title ||
			!messages ||
			!Array.isArray(messages) ||
			messages.length === 0
		) {
			return NextResponse.json(
				{ error: "Title and messages are required" },
				{ status: 400 }
			);
		}

		// Валидация сообщений
		for (const message of messages) {
			if (!message.originalText || !message.translatedText) {
				return NextResponse.json(
					{ error: "All messages must have originalText and translatedText" },
					{ status: 400 }
				);
			}
		}

		// Создаем диалог с сообщениями
		const dialogue = await prisma.dialogue.create({
			data: {
				title,
				messages: {
					create: messages.map(
						(message: { originalText: string; translatedText: string }) => ({
							originalText: message.originalText,
							translatedText: message.translatedText,
						})
					),
				},
			},
			include: {
				messages: true,
			},
		});

		return NextResponse.json({
			success: true,
			dialogue,
		});
	} catch (error) {
		console.error("Create dialogue error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
