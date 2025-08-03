import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../../../../prisma/prisma-client";
import type { NextRequest } from "next/server";

// GET /api/phrases
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const categoryId = searchParams.get("categoryId");

		if (!categoryId) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		const phrases = await prisma.phrase.findMany({
			where: { categoryId: Number(categoryId) },
		});

		// Проверяем длину массива фраз
		if (phrases.length === 0) {
			return NextResponse.json({ error: "No phrases found" }, { status: 404 });
		}

		return NextResponse.json(phrases);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// POST /api/phrases
export async function POST(req: NextRequest) {
	try {
		// Проверяем авторизацию
		const token = (await cookies()).get("token");

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Проверяем валидность токена
		const decoded = verify(
			token.value,
			process.env.JWT_SECRET || "fallback-secret"
		) as {
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
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		// Проверяем права доступа (только MODERATOR и ADMIN)
		if (user.role !== "MODERATOR" && user.role !== "ADMIN") {
			return NextResponse.json(
				{ error: "Insufficient permissions" },
				{ status: 403 }
			);
		}

		// Получаем данные из запроса
		const { title, translate, transcription, categoryId } = await req.json();

		// Валидация данных
		if (!title || !translate || !transcription || !categoryId) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Проверяем существование категории
		const category = await prisma.category.findUnique({
			where: { id: Number(categoryId) },
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		// Создаем новую фразу
		const phrase = await prisma.phrase.create({
			data: {
				title,
				translate,
				transcription,
				categoryId: Number(categoryId),
			},
		});

		return NextResponse.json({
			success: true,
			phrase,
		});
	} catch (error) {
		console.error("Create phrase error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PUT /api/phrases
export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, title, translate, transcription, audioUrl, categoryId } = body;

		const updatedPhrase = await prisma.phrase.update({
			where: { id: Number(id) },
			data: {
				title,
				translate,
				transcription,
				audioUrl,
				category: {
					connect: { id: Number(categoryId) },
				},
			},
		});

		return NextResponse.json(updatedPhrase);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// DELETE /api/phrases
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const phraseId = searchParams.get("id");

		if (!phraseId) {
			return NextResponse.json(
				{ error: "Phrase ID is required" },
				{ status: 400 }
			);
		}

		await prisma.phrase.delete({
			where: { id: Number(phraseId) },
		});

		return NextResponse.json(
			{ message: "Phrase deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
