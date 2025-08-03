import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import type { NextRequest } from "next/server";
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from "../../../lib/auth-utils";

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
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
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
