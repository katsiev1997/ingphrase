import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';

export async function GET() {
	try {
		// Получаем токен из куки
		const token = (await cookies()).get('token');

		if (!token) {
			return NextResponse.json(
				{
					authenticated: false,
				},
				{ status: 401 }
			);
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
			return NextResponse.json(
				{
					authenticated: false,
				},
				{ status: 401 }
			);
		}
		return NextResponse.json({
			authenticated: true,
			user: {
				id: user[0].id,
				email: user[0].email,
				role: user[0].role,
			},
		});
	} catch (error) {
		console.error('Auth check error:', error);
		return NextResponse.json(
			{
				authenticated: false,
				error: 'Invalid token',
			},
			{ status: 401 }
		);
	}
}
