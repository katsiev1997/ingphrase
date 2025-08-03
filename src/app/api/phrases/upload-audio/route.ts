import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";
import type { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from "@/shared/lib/auth-utils";

export async function POST(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем данные формы
		const formData = await req.formData();
		const phraseId = formData.get("phraseId") as string;
		const audioFile = formData.get("audio") as File;

		if (!phraseId || !audioFile) {
			return NextResponse.json(
				{ error: "Phrase ID and audio file are required" },
				{ status: 400 }
			);
		}

		// Проверяем существование фразы
		const phrase = await prisma.phrase.findUnique({
			where: { id: Number(phraseId) },
		});

		if (!phrase) {
			return NextResponse.json({ error: "Phrase not found" }, { status: 404 });
		}

		// Проверяем тип файла
		if (!audioFile.type.startsWith("audio/")) {
			return NextResponse.json(
				{ error: "Only audio files are allowed" },
				{ status: 400 }
			);
		}

		// Проверяем размер файла (максимум 10MB)
		if (audioFile.size > 10 * 1024 * 1024) {
			return NextResponse.json(
				{ error: "File size must be less than 10MB" },
				{ status: 400 }
			);
		}

		// Генерируем уникальное имя файла
		const fileExtension = audioFile.name.split(".").pop();
		const fileName = `phrase_${phraseId}_${Date.now()}.${fileExtension}`;

		// Загружаем файл в Vercel Blob Storage
		const { url } = await put(fileName, audioFile, {
			access: "public",
			addRandomSuffix: false,
		});

		// Обновляем фразу в базе данных
		await prisma.phrase.update({
			where: { id: Number(phraseId) },
			data: { audioUrl: url },
		});

		return NextResponse.json({
			success: true,
			audioUrl: url,
		});
	} catch (error) {
		console.error("Upload audio error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
