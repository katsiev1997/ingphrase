"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/use-auth";
import { useLogin } from "@/shared/hooks/use-login";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const { user, loading } = useAuth();
	const loginMutation = useLogin();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			return;
		}

		try {
			await loginMutation.mutateAsync({ email });
			// Перенаправляем на главную страницу через 1 секунду
			setTimeout(() => {
				window.location.href = "/";
			}, 1000);
		} catch (error) {
			// Ошибка обрабатывается автоматически через React Query
			console.error("Login error:", error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-emerald-950 px-4">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
			</div>
		);
	}

	// Если пользователь уже авторизован, показываем сообщение об успешной авторизации
	if (user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-emerald-950 px-4">
				<div className="max-w-md w-full space-y-8">
					{/* Кнопка назад */}
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Назад
					</Link>

					{/* Сообщение об авторизации */}
					<div className="bg-white dark:bg-emerald-900 rounded-lg shadow-md p-8">
						<div className="text-center">
							<div className="text-green-500 text-6xl mb-4">✓</div>
							<h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
								Вы уже авторизованы!
							</h3>
							<p className="text-emerald-600 dark:text-emerald-400 mb-6">
								Добро пожаловать, {user.email}
							</p>
							<Link
								href="/"
								className="inline-block bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
							>
								Перейти на главную
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-emerald-950 px-4">
			<div className="max-w-md w-full space-y-8">
				{/* Кнопка назад */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					Назад
				</Link>

				{/* Форма */}
				<div className="bg-white dark:bg-emerald-900 rounded-lg shadow-md p-8">
					<div className="text-center mb-8">
						<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-800 mb-4">
							<Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
						</div>
						<h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
							Вход в приложение
						</h2>
						<p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
							Введите ваш email для входа в приложение
						</p>
					</div>

					{loginMutation.isSuccess ?
						<div className="text-center">
							<div className="text-green-500 text-6xl mb-4">✓</div>
							<h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
								Успешная авторизация!
							</h3>
							<p className="text-emerald-600 dark:text-emerald-400 mb-6">
								{loginMutation.data?.message || "Успешная авторизация!"}
							</p>
							<p className="text-sm text-emerald-500 dark:text-emerald-400">
								Перенаправление на главную страницу...
							</p>
						</div>
					:	<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2"
								>
									Email
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
									className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 placeholder-emerald-500 dark:placeholder-emerald-400"
									disabled={loginMutation.isPending}
								/>
							</div>

							{loginMutation.isError && (
								<div className="text-red-600 dark:text-red-400 text-sm text-center">
									{loginMutation.error?.message ||
										"Произошла ошибка при авторизации"}
								</div>
							)}

							<button
								type="submit"
								disabled={loginMutation.isPending}
								className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
							>
								{loginMutation.isPending ?
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
										Вход...
									</>
								:	<>
										<Mail className="h-5 w-5" />
										Войти в приложение
									</>
								}
							</button>
						</form>
					}

					<div className="mt-6 text-center">
						<p className="text-xs text-emerald-500 dark:text-emerald-400">
							Введите ваш email для входа в приложение
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
