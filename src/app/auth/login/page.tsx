"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			setStatus("error");
			setMessage("Пожалуйста, введите email");
			return;
		}

		setStatus("loading");
		setMessage("");

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				setStatus("success");
				setMessage("Ссылка для входа отправлена на ваш email!");
			} else {
				setStatus("error");
				setMessage(data.error || "Произошла ошибка при отправке");
			}
		} catch {
			setStatus("error");
			setMessage("Произошла ошибка при отправке запроса");
		}
	};

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
							Введите ваш email для получения ссылки для входа
						</p>
					</div>

					{status === "success" ?
						<div className="text-center">
							<div className="text-green-500 text-6xl mb-4">✓</div>
							<h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
								Проверьте ваш email!
							</h3>
							<p className="text-emerald-600 dark:text-emerald-400 mb-6">
								{message}
							</p>
							<button
								onClick={() => {
									setStatus("idle");
									setEmail("");
									setMessage("");
								}}
								className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
							>
								Отправить еще раз
							</button>
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
									disabled={status === "loading"}
								/>
							</div>

							{status === "error" && (
								<div className="text-red-600 dark:text-red-400 text-sm text-center">
									{message}
								</div>
							)}

							<button
								type="submit"
								disabled={status === "loading"}
								className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
							>
								{status === "loading" ?
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
										Отправка...
									</>
								:	<>
										<Mail className="h-5 w-5" />
										Отправить ссылку для входа
									</>
								}
							</button>
						</form>
					}

					<div className="mt-6 text-center">
						<p className="text-xs text-emerald-500 dark:text-emerald-400">
							Ссылка для входа действительна в течение 15 минут
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
