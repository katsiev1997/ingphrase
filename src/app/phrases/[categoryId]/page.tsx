import { PhraseList } from "@/features/phrase-list";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategoriesRequest } from "@/entities/category/ui/model/api/get-categories-request";
import { PhrasesSkeleton } from "@/shared/ui/phrases-skeleton";
import { QueryClient } from "@tanstack/react-query";
import { getPhrasesRequest } from "@/entities/phrase/model/api/get-phrases-request";
import { CategoryTitle } from "@/entities/category/ui/category-title";

type Props = {
	params: Promise<{
		categoryId: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const categoryId = parseInt((await params).categoryId);

	try {
		const categories = await getCategoriesRequest();
		const category = categories.find((cat) => cat.id === categoryId);

		return {
			title: category ? `${category.name} | IngPhrase` : "Фразы | IngPhrase",
			description:
				category ?
					`Фразы категории "${category.name}" на ингушском языке`
				:	"Фразы на ингушском языке",
		};
	} catch {
		return {
			title: "Фразы | IngPhrase",
			description: "Фразы на ингушском языке",
		};
	}
}

export default async function PhrasesPage({ params }: Props) {
	const categoryId = (await params).categoryId;

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["phrases", categoryId],
		queryFn: () => getPhrasesRequest(Number(categoryId)),
	});

	return (
		<div className="w-full h-full pb-[100px]">
			<div className="px-4 py-6 flex items-center justify-between">
				<CategoryTitle categoryId={categoryId} />
				<Link href="/" className="text-emerald-600 dark:text-emerald-400">
					<div className="w-full max-w-52 flex justify-center items-center gap-2 text-sm border border-emerald-600 dark:border-emerald-400 rounded-md px-4 py-2">
						<ArrowLeftIcon />
						<p>Назад</p>
					</div>
				</Link>
			</div>
			<Suspense fallback={<PhrasesSkeleton />}>
				<PhraseList categoryId={categoryId} />
			</Suspense>
		</div>
	);
}
