import { getCategoriesRequest } from "@/entities/category/ui/model/api/get-categories-request";
import { CategoriesList } from "@/features/category-list";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { CategoriesSkeleton } from "@/shared/ui/categories-skeleton";
import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Категории фраз | IngPhrase",
	description: "Выберите категорию фраз для изучения ингушского языка",
};

export default async function Home() {
	const queryClient = new QueryClient();

	await queryClient.fetchQuery({
		queryKey: ["categories"],
		queryFn: () => getCategoriesRequest(),
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="w-full h-full pb-[100px]">
				<Suspense fallback={<CategoriesSkeleton />}>
					<CategoriesList />
				</Suspense>
			</div>
		</HydrationBoundary>
	);
}
