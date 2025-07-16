"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const savedTheme = localStorage.getItem("theme") as Theme;
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);

		localStorage.setItem("theme", theme);
	}, [theme, mounted]);

	const toggleTheme = () => {
		setTheme((prev) => {
			if (prev === "light") return "dark";
			return "light";
		});
	};

	return {
		theme,
		setTheme,
		toggleTheme,
		mounted,
	};
}
