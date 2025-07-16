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
			<div className="px-4 py-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
					Поиск фраз
				</h1>
				<Link href="/" className="text-emerald-600 dark:text-emerald-400">
					<div className="w-full max-w-52 flex justify-center items-center gap-2 text-sm border border-emerald-600 dark:border-emerald-400 rounded-md px-4 py-2">
						<ArrowLeftIcon />
						<p>Назад</p>
					</div>
				</Link>
			</div>
			<Suspense fallback={<Loader />}>
				<PhraseSearch />
			</Suspense>
		</div>
	);
}
