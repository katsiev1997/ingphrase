"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/shared/hooks/use-theme";

export function ThemeToggle() {
	const { theme, toggleTheme, mounted } = useTheme();

	if (!mounted) {
		return (
			<div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 animate-pulse" />
		);
	}

	const getIcon = () => {
		switch (theme) {
			case "light":
				return <Sun className="h-5 w-5" />;
			case "dark":
				return <Moon className="h-5 w-5" />;
			default:
				return <Monitor className="h-5 w-5" />;
		}
	};

	const getLabel = () => {
		switch (theme) {
			case "light":
				return "Светлая тема";
			case "dark":
				return "Темная тема";
			default:
				return "Системная тема";
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className="flex items-center gap-3 w-full p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200"
			aria-label={`Переключить тему. Текущая: ${getLabel()}`}
		>
			<div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
				{getIcon()}
			</div>
			<div className="flex flex-col items-start">
				<span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
					Тема
				</span>
				<span className="text-xs text-emerald-600 dark:text-emerald-400">
					{getLabel()}
				</span>
			</div>
		</button>
	);
}
