import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Избранные фразы | IngPhrase",
	description: "Ваши избранные фразы на ингушском языке",
};

export default function FavoritesPage() {
	return (
		<div className="w-full h-full pb-[100px]">
			<div className="px-4 py-6">
				<h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
					Избранные фразы
				</h1>
			</div>
			<div className="px-4">
				<p className="text-emerald-600 dark:text-emerald-400">
					Здесь будут отображаться ваши избранные фразы
				</p>
			</div>
		</div>
	);
}
