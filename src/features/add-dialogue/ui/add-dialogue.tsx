"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useCreateDialogue } from "@/entities/dialogue/model/mutations/use-create-dialogue";
import { useAuth } from "@/shared/hooks/use-auth";

interface Message {
	originalText: string;
	translatedText: string;
}

export const AddDialogue = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [messages, setMessages] = useState<Message[]>([
		{ originalText: "", translatedText: "" },
	]);
	const [error, setError] = useState("");

	const { user } = useAuth();
	const createDialogue = useCreateDialogue();

	// Проверяем права доступа
	const canAddDialogue = user?.role === "MODERATOR" || user?.role === "ADMIN";

	if (!canAddDialogue) {
		return null;
	}

	const addMessage = () => {
		setMessages([...messages, { originalText: "", translatedText: "" }]);
	};

	const removeMessage = (index: number) => {
		if (messages.length > 1) {
			setMessages(messages.filter((_, i) => i !== index));
		}
	};

	const updateMessage = (
		index: number,
		field: keyof Message,
		value: string
	) => {
		const newMessages = [...messages];
		newMessages[index] = { ...newMessages[index], [field]: value };
		setMessages(newMessages);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!title.trim()) {
			setError("Название диалога обязательно");
			return;
		}

		// Проверяем, что все сообщения заполнены
		const validMessages = messages.filter(
			(msg) => msg.originalText.trim() && msg.translatedText.trim()
		);

		if (validMessages.length === 0) {
			setError("Добавьте хотя бы одно сообщение");
			return;
		}

		try {
			await createDialogue.mutateAsync({
				title: title.trim(),
				messages: validMessages.map((msg) => ({
					originalText: msg.originalText.trim(),
					translatedText: msg.translatedText.trim(),
				})),
			});

			// Очищаем форму и закрываем
			setTitle("");
			setMessages([{ originalText: "", translatedText: "" }]);
			setIsOpen(false);
		} catch (error: unknown) {
			let errorMessage = "Произошла ошибка при добавлении диалога";

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
		setMessages([{ originalText: "", translatedText: "" }]);
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
					Добавить диалог
				</button>
			:	<div className="bg-white dark:bg-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-800 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
							Добавить новый диалог
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
								Название диалога
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
								placeholder="Введите название диалога"
								disabled={createDialogue.isPending}
							/>
						</div>

						<div>
							<div className="flex items-center justify-between mb-2">
								<label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100">
									Сообщения диалога
								</label>
								<button
									type="button"
									onClick={addMessage}
									className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 text-sm"
								>
									+ Добавить сообщение
								</button>
							</div>

							<div className="space-y-3">
								{messages.map((message, index) => (
									<div
										key={index}
										className="p-4 border border-emerald-200 dark:border-emerald-700 rounded-lg"
									>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
												Сообщение {index + 1}
											</span>
											{messages.length > 1 && (
												<button
													type="button"
													onClick={() => removeMessage(index)}
													className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
												>
													<X className="h-4 w-4" />
												</button>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<label className="block text-xs text-emerald-600 dark:text-emerald-400 mb-1">
													Оригинальный текст
												</label>
												<input
													type="text"
													value={message.originalText}
													onChange={(e) =>
														updateMessage(index, "originalText", e.target.value)
													}
													className="w-full px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-sm"
													placeholder="Текст на ингушском"
													disabled={createDialogue.isPending}
												/>
											</div>

											<div>
												<label className="block text-xs text-emerald-600 dark:text-emerald-400 mb-1">
													Перевод
												</label>
												<input
													type="text"
													value={message.translatedText}
													onChange={(e) =>
														updateMessage(
															index,
															"translatedText",
															e.target.value
														)
													}
													className="w-full px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-sm"
													placeholder="Перевод на русский"
													disabled={createDialogue.isPending}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{error && (
							<div className="text-red-600 dark:text-red-400 text-sm">
								{error}
							</div>
						)}

						<div className="flex gap-3">
							<button
								type="submit"
								disabled={createDialogue.isPending}
								className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{createDialogue.isPending ? "Добавление..." : "Добавить диалог"}
							</button>
							<button
								type="button"
								onClick={handleCancel}
								disabled={createDialogue.isPending}
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
