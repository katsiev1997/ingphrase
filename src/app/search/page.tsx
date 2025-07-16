import { PhraseSearch } from "@/features/phrase-search";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader } from "@/shared/ui/loader";

export const metadata: Metadata = {
	title: "Поиск фраз | IngPhrase",
	description: "Поиск фраз на ингушском языке",
};

export default function SearchPage() {
	return (
		<div className="w-full h-full pb-[100px]">
			<div className="px-4 py-6">
				<h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
					Поиск фраз
				</h1>
			</div>
			<Suspense fallback={<Loader />}>
				<Link href="/" className="text-emerald-600 dark:text-emerald-400 mx-4">
					<div className="w-52 mx-5 flex items-center gap-2 text-sm border border-emerald-600 dark:border-emerald-400 rounded-md px-4 py-2">
						<ArrowLeftIcon />
						<p>Вернуться назад</p>
					</div>
				</Link>
				<PhraseSearch />
			</Suspense>
		</div>
	);
}
