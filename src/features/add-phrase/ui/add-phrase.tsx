"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useCreatePhrase } from "@/entities/phrase/model/mutations/use-create-phrase";
import { useAuth } from "@/shared/hooks/use-auth";

interface AddPhraseProps {
	categoryId: string;
}

export const AddPhrase = ({ categoryId }: AddPhraseProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [translate, setTranslate] = useState("");
	const [transcription, setTranscription] = useState("");
	const [error, setError] = useState("");

	const { user } = useAuth();
	const createPhrase = useCreatePhrase();

	// Проверяем права доступа
	const canAddPhrase = user?.role === "MODERATOR" || user?.role === "ADMIN";

	if (!canAddPhrase) {
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!title.trim() || !translate.trim() || !transcription.trim()) {
			setError("Все поля обязательны для заполнения");
			return;
		}

		try {
			await createPhrase.mutateAsync({
				title: title.trim(),
				translate: translate.trim(),
				transcription: transcription.trim(),
				categoryId: Number(categoryId),
			});

			// Очищаем форму и закрываем
			setTitle("");
			setTranslate("");
			setTranscription("");
			setIsOpen(false);
		} catch (error: unknown) {
			let errorMessage = "Произошла ошибка при добавлении фразы";

			if (error && typeof error === "object" && "response" in error) {
				const response = (error as { response?: { data?: { error?: string } } })
					.response;
				if (response?.data?.error) {
					errorMessage = response.data.error;
				}
			}

			setError(errorMessage);
		}
	};

	const handleCancel = () => {
		setTitle("");
		setTranslate("");
		setTranscription("");
		setError("");
		setIsOpen(false);
	};

	return (
		<div className="py-6">
			{!isOpen ?
				<button
					onClick={() => setIsOpen(true)}
					className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
				>
					<Plus className="h-5 w-5" />
					Добавить фразу
				</button>
			:	<div className="bg-white dark:bg-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-800 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
							Добавить новую фразу
						</h3>
						<button
							onClick={handleCancel}
							className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
								Фраза на русском
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
								placeholder="Введите фразу на русском языке"
								disabled={createPhrase.isPending}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
								Перевод на ингушский
							</label>
							<input
								type="text"
								value={translate}
								onChange={(e) => setTranslate(e.target.value)}
								className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
								placeholder="Введите перевод на ингушский язык"
								disabled={createPhrase.isPending}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
								Транскрипция
							</label>
							<input
								type="text"
								value={transcription}
								onChange={(e) => setTranscription(e.target.value)}
								className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
								placeholder="Введите транскрипцию"
								disabled={createPhrase.isPending}
							/>
						</div>

						{error && (
							<div className="text-red-600 dark:text-red-400 text-sm">
								{error}
							</div>
						)}

						<div className="flex gap-3">
							<button
								type="submit"
								disabled={createPhrase.isPending}
								className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{createPhrase.isPending ? "Добавление..." : "Добавить фразу"}
							</button>
							<button
								type="button"
								onClick={handleCancel}
								disabled={createPhrase.isPending}
								className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								Отмена
							</button>
						</div>
					</form>
				</div>
			}
		</div>
	);
};
