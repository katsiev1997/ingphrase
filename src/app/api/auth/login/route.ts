import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { users } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		// Поиск существующего пользователя или создание нового
		let user = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (user.length === 0) {
			const newUser = await db.insert(users).values({ email }).returning();
			user = newUser;
		}

		const userData = user[0];

		// Создаем JWT токен для авторизации
		const token = sign(
			{
				userId: userData.id,
				email: userData.email,
			},
			process.env.JWT_SECRET || 'fallback-secret',
			{ expiresIn: '14d' }
		);

		// Устанавливаем куки с токеном
		(await cookies()).set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 14, // 14 дней
		});

		return NextResponse.json({
			success: true,
			message: 'Authentication successful',
			user: {
				id: userData.id,
				email: userData.email,
				role: userData.role,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
