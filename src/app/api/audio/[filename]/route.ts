import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { NextRequest } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ filename: string }> }
) {
	try {
		const { filename } = await params;

		// Проверяем безопасность имени файла
		if (!filename || filename.includes("..") || filename.includes("/")) {
			return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
		}

		const filePath = join(
			process.cwd(),
			"public",
			"uploads",
			"audio",
			filename
		);

		// Проверяем существование файла
		if (!existsSync(filePath)) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		// Читаем файл
		const fileBuffer = await readFile(filePath);

		// Определяем MIME тип на основе расширения
		const extension = filename.split(".").pop()?.toLowerCase();
		let contentType = "audio/wav"; // по умолчанию

		switch (extension) {
			case "mp3":
				contentType = "audio/mpeg";
				break;
			case "wav":
				contentType = "audio/wav";
				break;
			case "ogg":
				contentType = "audio/ogg";
				break;
			case "m4a":
				contentType = "audio/mp4";
				break;
			default:
				contentType = "audio/wav";
		}

		// Возвращаем файл с правильными заголовками
		return new NextResponse(fileBuffer, {
			headers: {
				"Content-Type": contentType,
				"Content-Length": fileBuffer.length.toString(),
				"Cache-Control": "public, max-age=31536000", // кеширование на 1 год
			},
		});
	} catch (error) {
		console.error("Audio file serving error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
