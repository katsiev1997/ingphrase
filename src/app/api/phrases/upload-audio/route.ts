import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";
import type { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import ffmpeg from "ffmpeg-static";
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from "@/shared/lib/auth-utils";

// Функция для конвертации аудио в MP3
async function convertToMp3(
	inputBuffer: Buffer,
	inputFormat: string
): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const inputPath = join(tmpdir(), `input_${Date.now()}.${inputFormat}`);
		const outputPath = join(tmpdir(), `output_${Date.now()}.mp3`);

		// Записываем входной файл
		writeFile(inputPath, inputBuffer)
			.then(() => {
				// Конвертируем в MP3
				const ffmpegProcess = spawn(ffmpeg!, [
					"-i",
					inputPath,
					"-acodec",
					"libmp3lame",
					"-ab",
					"128k",
					"-ar",
					"44100",
					"-y", // Перезаписывать выходной файл
					outputPath,
				]);

				let stderr = "";
				ffmpegProcess.stderr.on("data", (data) => {
					stderr += data.toString();
				});

				ffmpegProcess.on("close", async (code) => {
					try {
						// Удаляем входной файл
						await unlink(inputPath);

						if (code === 0) {
							// Читаем выходной файл
							const fs = await import("fs/promises");
							const outputBuffer = await fs.readFile(outputPath);

							// Удаляем выходной файл
							await fs.unlink(outputPath);

							resolve(outputBuffer);
						} else {
							// Удаляем выходной файл если он существует
							try {
								await unlink(outputPath);
							} catch {}

							reject(new Error(`FFmpeg conversion failed: ${stderr}`));
						}
					} catch (error) {
						reject(error);
					}
				});

				ffmpegProcess.on("error", (error) => {
					reject(error);
				});
			})
			.catch(reject);
	});
}

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

		// Получаем буфер файла
		const bytes = await audioFile.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Определяем формат входного файла
		const inputFormat = audioFile.name.split(".").pop()?.toLowerCase() || "wav";

		// Конвертируем в MP3
		let mp3Buffer: Buffer;
		try {
			mp3Buffer = await convertToMp3(buffer, inputFormat);
		} catch (error) {
			console.error("Audio conversion error:", error);
			return NextResponse.json(
				{ error: "Failed to convert audio file" },
				{ status: 500 }
			);
		}

		// Генерируем уникальное имя файла с расширением .mp3
		const fileName = `phrase_${phraseId}_${Date.now()}.mp3`;

		// Создаем Blob из MP3 буфера
		const mp3Blob = new Blob([mp3Buffer], { type: "audio/mpeg" });

		// Загружаем файл в Vercel Blob Storage
		const { url } = await put(fileName, mp3Blob, {
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
