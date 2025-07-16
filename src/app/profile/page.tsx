"use client";

import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";

export default function ProfilePage() {
	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});
			if (response.ok) {
				window.location.href = "/";
			}
		} catch (error) {
			console.error("Ошибка при выходе:", error);
		}
	};

	return (
		<div className="w-full h-full pb-[100px]">
			<div className="flex flex-col gap-6 px-4 py-6">
				{/* Заголовок */}
				<div className="text-center">
					<h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
						Профиль
					</h1>
					<p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
						Управление настройками приложения
					</p>
				</div>

				{/* Переключатель темы */}
				<div className="space-y-2">
					<h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
						Внешний вид
					</h2>
					<ThemeToggle />
				</div>

				{/* Другие настройки */}
				<div className="space-y-2">
					<h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
						Настройки
					</h2>
					<div className="space-y-2">
						<button className="flex items-center gap-3 w-full p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200">
							<div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
								<User className="h-5 w-5" />
							</div>
							<div className="flex flex-col items-start">
								<span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
									Личные данные
								</span>
								<span className="text-xs text-emerald-600 dark:text-emerald-400">
									Изменить информацию профиля
								</span>
							</div>
						</button>

						<button className="flex items-center gap-3 w-full p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200">
							<div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
								<Bell className="h-5 w-5" />
							</div>
							<div className="flex flex-col items-start">
								<span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
									Уведомления
								</span>
								<span className="text-xs text-emerald-600 dark:text-emerald-400">
									Настройки уведомлений
								</span>
							</div>
						</button>

						<button className="flex items-center gap-3 w-full p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200">
							<div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
								<Shield className="h-5 w-5" />
							</div>
							<div className="flex flex-col items-start">
								<span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
									Безопасность
								</span>
								<span className="text-xs text-emerald-600 dark:text-emerald-400">
									Настройки безопасности
								</span>
							</div>
						</button>

						<button className="flex items-center gap-3 w-full p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200">
							<div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
								<HelpCircle className="h-5 w-5" />
							</div>
							<div className="flex flex-col items-start">
								<span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
									Помощь
								</span>
								<span className="text-xs text-emerald-600 dark:text-emerald-400">
									FAQ и поддержка
								</span>
							</div>
						</button>
					</div>
				</div>

				{/* Выход */}
				<div className="space-y-2">
					<button
						onClick={handleLogout}
						className="flex items-center gap-3 w-full p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
					>
						<div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
							<LogOut className="h-5 w-5" />
						</div>
						<div className="flex flex-col items-start">
							<span className="text-sm font-medium text-red-900 dark:text-red-100">
								Выйти
							</span>
							<span className="text-xs text-red-600 dark:text-red-400">
								Завершить сессию
							</span>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
