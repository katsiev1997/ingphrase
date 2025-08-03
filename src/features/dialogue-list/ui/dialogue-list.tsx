"use client";

import { useGetDialogues } from "@/entities/dialogue/model/queries/use-get-dialogues";
import { DialogueCard } from "@/entities/dialogue/ui/dialogue-card";

export const DialogueList = () => {
	const { data: dialogues, isPending } = useGetDialogues();

	if (isPending) {
		return (
			<div className="flex flex-col gap-4 px-4 py-6">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className="bg-white dark:bg-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-800 p-6 animate-pulse"
					>
						<div className="h-6 bg-emerald-200 dark:bg-emerald-700 rounded mb-4"></div>
						<div className="space-y-2">
							<div className="h-4 bg-emerald-200 dark:bg-emerald-700 rounded"></div>
							<div className="h-4 bg-emerald-200 dark:bg-emerald-700 rounded w-3/4"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!dialogues || dialogues.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 px-4">
				<div className="text-center">
					<div className="text-emerald-400 dark:text-emerald-600 text-6xl mb-4">
						💬
					</div>
					<h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
						Диалоги пока не добавлены
					</h3>
					<p className="text-emerald-600 dark:text-emerald-400">
						Здесь будут отображаться диалоги на ингушском языке
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 px-4 py-6">
			{dialogues.map((dialogue) => (
				<DialogueCard key={dialogue.id} dialogue={dialogue} />
			))}
		</div>
	);
};
