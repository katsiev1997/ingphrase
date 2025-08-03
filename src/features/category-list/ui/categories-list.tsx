"use client";

import { useGetCategories } from "@/entities/category/ui/model/queries/use-get-categories";
import { CategoryCard } from "@/entities/phrase/ui/category-card";
import { CategoriesSkeleton } from "@/shared/ui/categories-skeleton";
import { AddCategory } from "@/features/add-category";

export const CategoriesList = () => {
	const { data, isPending } = useGetCategories();

	if (isPending) {
		return <CategoriesSkeleton />;
	}

	return (
		<div className="flex flex-col gap-4 overflow-y-auto">
			<div className="px-4 py-6">
				<h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
					Выберите категорию
				</h1>
			</div>
			
			<div className="flex flex-col gap-4 px-4">
				{data?.map((category) => (
					<CategoryCard
						key={category.id}
						id={String(category.id)}
						category={category.name}
					/>
				))}
			</div>
			
			<AddCategory />
		</div>
	);
};
