import { getCategoriesRequest } from "@/entities/category/ui/model/api/get-categories-request";
import { CategoriesList } from "@/features/category-list";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { Loader } from "@/shared/ui/loader";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Категории фраз | IngPhrase",
	description: "Выберите категорию фраз для изучения ингушского языка",
};

export default async function Home() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["categories"],
		queryFn: () => getCategoriesRequest(),
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="w-full h-full pb-[100px]">
				<div className="px-4 py-6">
					<h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
						Выберите категорию
					</h1>
				</div>
				<Suspense fallback={<Loader />}>
					<CategoriesList />
				</Suspense>
			</div>
		</HydrationBoundary>
	);
}
