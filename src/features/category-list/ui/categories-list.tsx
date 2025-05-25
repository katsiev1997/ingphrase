"use client";

import { useGetCategories } from "@/entities/category/ui/model/queries/use-get-categories";
import { CategoryCard } from "@/entities/phrase/ui/category-card";
import { Loader2Icon } from "lucide-react";

export const CategoriesList = () => {
	const { data, isPending } = useGetCategories();

	if (isPending) {
		return (
			<Loader2Icon className="animate-spin text-emerald-600 h-20 w-20 dark:text-emerald-400" />
		);
	}

	return (
		<div className="flex flex-col gap-4 px-4 py-6 overflow-y-auto">
			{data?.map((category) => (
				<CategoryCard key={category.id} id={String(category.id)} category={category.name} />
			))}
		</div>
	);
};
