import { prisma } from "../../../../../prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/phrases/search
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const query = searchParams.get("query");

		if (!query) {
			return NextResponse.json({ error: "Search query is required" }, { status: 400 });
		}

		const phrases = await prisma.phrase.findMany({
			where: {
				OR: [
					{ title: { contains: query, mode: "insensitive" } }, // Поиск по title (регистр не учитывается)
					{ translate: { contains: query, mode: "insensitive" } }, // Поиск по translate
				],
			},
			include: {
				category: true, // Включаем категорию
				favoritedBy: true, // Включаем пользователей, которые добавили фразу в избранное
			},
		});

		return NextResponse.json(phrases);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
