import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { categories, users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';

// GET /api/categories
export async function GET() {
	try {
		const categoriesList = await db.select().from(categories);

		return NextResponse.json(categoriesList);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// POST /api/categories
export async function POST(req: Request) {
	try {
		// Проверяем авторизацию
		const token = (await cookies()).get('token');

		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Проверяем валидность токена
		const decoded = verify(
			token.value,
			process.env.JWT_SECRET || 'fallback-secret'
		) as {
			userId: string;
		};

		// Получаем информацию о пользователе
		const user = await db
			.select({
				id: users.id,
				email: users.email,
				role: users.role,
			})
			.from(users)
			.where(eq(users.id, Number(decoded.userId)))
			.limit(1);

		if (user.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 401 });
		}

		const userData = user[0];

		// Проверяем роль пользователя
		if (userData.role !== 'ADMIN' && userData.role !== 'MODERATOR') {
			return NextResponse.json(
				{ error: 'Insufficient permissions' },
				{ status: 403 }
			);
		}

		// Получаем данные из запроса
		const { name } = await req.json();

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return NextResponse.json(
				{ error: 'Category name is required' },
				{ status: 400 }
			);
		}

		// Проверяем, что категория с таким именем не существует
		const existingCategory = await db
			.select()
			.from(categories)
			.where(eq(categories.name, name.trim()))
			.limit(1);

		if (existingCategory.length > 0) {
			return NextResponse.json(
				{ error: 'Category with this name already exists' },
				{ status: 409 }
			);
		}

		// Создаем новую категорию
		const newCategory = await db
			.insert(categories)
			.values({
				name: name.trim(),
			})
			.returning();

		return NextResponse.json(newCategory[0], { status: 201 });
	} catch (error) {
		console.error('Create category error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// PUT /api/categories
export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { id, name } = body;

		if (!id || !name) {
			return NextResponse.json(
				{ error: 'Category ID and name are required' },
				{ status: 400 }
			);
		}

		const updatedCategory = await db
			.update(categories)
			.set({
				name,
			})
			.where(eq(categories.id, Number(id)))
			.returning();

		return NextResponse.json(updatedCategory[0]);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// DELETE /api/categories
export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get('id');

		if (!categoryId) {
			return NextResponse.json(
				{ error: 'Category ID is required' },
				{ status: 400 }
			);
		}

		// Удаляем категорию
		await db.delete(categories).where(eq(categories.id, Number(categoryId)));

		return NextResponse.json({ message: 'Category deleted successfully' });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
