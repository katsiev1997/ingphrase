"use client";

import { PhraseCard } from "@/entities/category/ui/phrase-card";
import { useSearchPhrases } from "@/entities/phrase/model/queries/use-search-phrases";
import { Loader } from "@/shared/ui/loader";
import { useState } from "react";

export const PhraseSearch = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const { data, isPending } = useSearchPhrases(searchQuery);
	const [openPhraseId, setOpenPhraseId] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-4 px-4 py-6">
			<input
				type="text"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder="Введите текст для поиска..."
				className="w-full p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-400"
			/>

			{isPending && searchQuery.length > 0 && <Loader />}

			<div className="flex flex-col gap-4 overflow-y-auto">
				{data?.map((phrase) => (
					<PhraseCard
						key={phrase.id}
						id={String(phrase.id)}
						phrase={phrase.title}
						translation={phrase.translate}
						transcription={phrase.transcription}
						isOpen={openPhraseId === String(phrase.id)}
						setOpen={(isOpen) =>
							setOpenPhraseId(isOpen ? String(phrase.id) : null)
						}
					/>
				))}
				{data?.length === 0 && searchQuery.length > 0 && (
					<div className="text-center text-emerald-900 dark:text-emerald-100">
						Ничего не найдено
					</div>
				)}
			</div>
		</div>
	);
};
