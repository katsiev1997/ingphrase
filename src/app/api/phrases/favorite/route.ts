import { prisma } from "../../../../../prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/phrases/favorites?userId=1
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		// Проверка на наличие userId в запросе
		if (!userId) {
			return NextResponse.json({ error: "User ID is required" }, { status: 400 });
		}

		// Получаем пользователя вместе с его избранными фразами
		const userWithFavorites = await prisma.user.findUnique({
			where: { id: Number(userId) },
			include: {
				favoritePhrases: true, // Включаем избранные фразы пользователя
			},
		});

		if (!userWithFavorites) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Возвращаем только избранные фразы
		return NextResponse.json(userWithFavorites.favoritePhrases);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// POST /api/phrases/favorite
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { userId, phraseId } = body;

		// Проверка на наличие необходимых данных
		if (!userId || !phraseId) {
			return NextResponse.json(
				{ error: "User ID and Phrase ID are required" },
				{ status: 400 }
			);
		}

		// Проверяем, существует ли пользователь
		const user = await prisma.user.findUnique({
			where: { id: Number(userId) },
			include: { favoritePhrases: true },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Проверяем, существует ли фраза
		const phrase = await prisma.phrase.findUnique({
			where: { id: Number(phraseId) },
		});

		if (!phrase) {
			return NextResponse.json({ error: "Phrase not found" }, { status: 404 });
		}

		// Добавляем фразу в избранное пользователя
		const updatedUser = await prisma.user.update({
			where: { id: Number(userId) },
			data: {
				favoritePhrases: {
					connect: { id: Number(phraseId) }, // Добавляем связь с фразой
				},
			},
			include: { favoritePhrases: true }, // Возвращаем обновленный список избранных фраз
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// DELETE /api/phrases/favorite
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const phraseId = searchParams.get("phraseId");

		if (!userId || !phraseId) {
			return NextResponse.json(
				{ error: "User ID and Phrase ID are required" },
				{ status: 400 }
			);
		}

		// Удаление фразы из избранного
		const updatedUser = await prisma.user.update({
			where: { id: Number(userId) },
			data: {
				favoritePhrases: {
					disconnect: { id: Number(phraseId) }, // Удаляем связь с фразой
				},
			},
			include: { favoritePhrases: true }, // Возвращаем обновленный список избранных фраз
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
