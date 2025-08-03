import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../../../../prisma/prisma-client";

// GET /api/categories
export async function GET() {
	try {
		const categories = await prisma.category.findMany();

		return NextResponse.json(categories);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// POST /api/categories
export async function POST(req: Request) {
	try {
		// Проверяем авторизацию
		const token = (await cookies()).get("token");

		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Проверяем валидность токена
		const decoded = verify(token.value, process.env.JWT_SECRET || "fallback-secret") as {
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
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 401 }
			);
		}

		// Проверяем роль пользователя
		if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
			return NextResponse.json(
				{ error: "Insufficient permissions" },
				{ status: 403 }
			);
		}

		// Получаем данные из запроса
		const { name } = await req.json();

		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return NextResponse.json(
				{ error: "Category name is required" },
				{ status: 400 }
			);
		}

		// Проверяем, что категория с таким именем не существует
		const existingCategory = await prisma.category.findUnique({
			where: { name: name.trim() },
		});

		if (existingCategory) {
			return NextResponse.json(
				{ error: "Category with this name already exists" },
				{ status: 409 }
			);
		}

		// Создаем новую категорию
		const newCategory = await prisma.category.create({
			data: {
				name: name.trim(),
			},
		});

		return NextResponse.json(newCategory, { status: 201 });
	} catch (error) {
		console.error("Create category error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PUT /api/categories
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { id, name } = body;

		if (!id || !name) {
			return NextResponse.json(
				{ error: "Category ID and name are required" },
				{ status: 400 }
			);
		}

		const updatedCategory = await prisma.category.update({
			where: { id: Number(id) },
			data: {
				name,
			},
		});

		return NextResponse.json(updatedCategory);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// DELETE /api/categories
export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("id");

		if (!categoryId) {
			return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
		}

		// Удаляем категорию
		await prisma.category.delete({
			where: { id: Number(categoryId) },
		});

		return NextResponse.json({ message: "Category deleted successfully" });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
