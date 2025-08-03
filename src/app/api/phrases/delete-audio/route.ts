import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";
import type { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from "../../../../shared/lib/auth-utils";

export async function DELETE(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем phraseId из URL параметров
		const { searchParams } = new URL(req.url);
		const phraseId = searchParams.get("phraseId");

		if (!phraseId) {
			return NextResponse.json(
				{ error: "Phrase ID is required" },
				{ status: 400 }
			);
		}

		// Получаем фразу из базы данных
		const phrase = await prisma.phrase.findUnique({
			where: { id: Number(phraseId) },
		});

		if (!phrase) {
			return NextResponse.json({ error: "Phrase not found" }, { status: 404 });
		}

		if (!phrase.audioUrl) {
			return NextResponse.json(
				{ error: "No audio file found for this phrase" },
				{ status: 404 }
			);
		}

		// Удаляем файл из Vercel Blob Storage
		if (phrase.audioUrl) {
			try {
				await del(phrase.audioUrl);
			} catch (error) {
				console.error("Error deleting blob:", error);
				// Продолжаем выполнение даже если файл не найден в blob storage
			}
		}

		// Обновляем фразу в базе данных
		await prisma.phrase.update({
			where: { id: Number(phraseId) },
			data: { audioUrl: null },
		});

		return NextResponse.json({
			success: true,
			message: "Audio file deleted successfully",
		});
	} catch (error) {
		console.error("Delete audio error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
