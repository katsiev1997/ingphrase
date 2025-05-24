"use client";

import { useGetPhrases } from "@/entities/phrase/model/queries/use-get-phrases";
import { PhraseCard } from "@/entities/phrase/ui/phrase-card";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export const PhraseList = () => {
	const { data, isPending } = useGetPhrases();
	const [openPhraseId, setOpenPhraseId] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-4 px-4 py-6 overflow-y-auto">
			{isPending && (
				<Loader2Icon className="animate-spin text-emerald-600 h-20 w-20 dark:text-emerald-400" />
			)}
			{data?.map((phrase) => (
				<PhraseCard
					key={phrase.id}
					id={String(phrase.id)}
					phrase={phrase.title}
					translation={phrase.translate}
					transcription={phrase.transcription}
					isOpen={openPhraseId === String(phrase.id)}
					setOpen={(isOpen) => setOpenPhraseId(isOpen ? String(phrase.id) : null)}
				/>
			))}
		</div>
	);
};
