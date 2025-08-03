import React from "react";
import type { Metadata } from "next";
import { DialogueList } from "@/features/dialogue-list";
import { AddDialogue } from "@/features/add-dialogue";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Диалоги | IngPhrase",
	description: "Диалоги на ингушском языке",
};

export default function DialogsPage() {
	return (
		<div className="w-full h-full pb-[100px]">
			<div className="px-4 py-6">
				<h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
					Диалоги
				</h1>
			</div>

			<Suspense fallback={<div>Загрузка...</div>}>
				<DialogueList />
			</Suspense>

			{/* Компонент добавления диалога */}
			<AddDialogue />
		</div>
	);
}
