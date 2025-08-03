"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { useCreateCategory } from "@/entities/category/ui/model/mutations/use-create-category";
import { useAuth } from "@/shared/hooks/use-auth";

export const AddCategory = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [categoryName, setCategoryName] = useState("");
	const { isModeratorOrAdmin, loading } = useAuth();
	const createCategoryMutation = useCreateCategory();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!categoryName.trim()) {
			return;
		}

		try {
			await createCategoryMutation.mutateAsync({ name: categoryName.trim() });
			setCategoryName("");
			setIsExpanded(false);
		} catch (error) {
			console.error("Failed to create category:", error);
		}
	};

	const handleCancel = () => {
		setCategoryName("");
		setIsExpanded(false);
	};

	// Скрываем компонент для неавторизованных пользователей или пользователей без прав
	if (loading || !isModeratorOrAdmin) {
		return null;
	}

	return (
		<div className="px-4 py-6">
			{!isExpanded ? (
				<button
					onClick={() => setIsExpanded(true)}
					className="flex items-center justify-center gap-2 w-full p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border-2 border-dashed border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200"
				>
					<Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
					<span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
						Добавить категорию
					</span>
				</button>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
								Новая категория
							</h3>
							<button
								type="button"
								onClick={handleCancel}
								className="p-1 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200"
							>
								<X className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
							</button>
						</div>
						
						<div className="space-y-3">
							<div>
								<label htmlFor="categoryName" className="block text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">
									Название категории
								</label>
								<input
									id="categoryName"
									type="text"
									value={categoryName}
									onChange={(e) => setCategoryName(e.target.value)}
									placeholder="Введите название категории"
									className="w-full px-3 py-2 text-sm border border-emerald-200 dark:border-emerald-800 rounded-md bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 placeholder-emerald-400 dark:placeholder-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
									disabled={createCategoryMutation.isPending}
								/>
							</div>
							
							<div className="flex gap-2">
								<button
									type="submit"
									disabled={!categoryName.trim() || createCategoryMutation.isPending}
									className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
								>
									{createCategoryMutation.isPending ? (
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									) : (
										<Check className="h-4 w-4" />
									)}
									{createCategoryMutation.isPending ? "Добавление..." : "Добавить"}
								</button>
								
								<button
									type="button"
									onClick={handleCancel}
									disabled={createCategoryMutation.isPending}
									className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
								>
									Отмена
								</button>
							</div>
							
							{createCategoryMutation.isError && (
								<div className="text-xs text-red-600 dark:text-red-400">
									{createCategoryMutation.error?.message || "Ошибка при добавлении категории"}
								</div>
							)}
						</div>
					</div>
				</form>
			)}
		</div>
	);
}; 