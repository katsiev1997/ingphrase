"use client";

import { PhraseCard } from "@/entities/category/ui/phrase-card";
import { useGetPhrases } from "@/entities/phrase/model/queries/use-get-phrases";
import { Loader } from "@/shared/ui/loader";
import { useState } from "react";

type Props = {
	categoryId: string;
};

export const PhraseList = ({ categoryId }: Props) => {
	const { data, isPending } = useGetPhrases(categoryId);
	const [openPhraseId, setOpenPhraseId] = useState<string | null>(null);

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="flex flex-col gap-4 px-4 py-6 overflow-y-auto">
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
		</div>
	);
};
