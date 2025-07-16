"use client";

import { PlusIcon } from "lucide-react";
import { useRef } from "react";

type PhraseCardProps = {
	phrase: string;
	translation: string;
	transcription: string;
	id: string;
	className?: string;
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
};

export function PhraseCard({
	phrase,
	translation,
	transcription,
	className,
	id,
	isOpen,
	setOpen,
}: PhraseCardProps) {
	const ref = useRef<HTMLDivElement>(null);

	const toggleAccordion = () => {
		setOpen(!isOpen);
	};

	return (
		<div
			className={`bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm overflow-hidden ${className}`}
			ref={ref}
		>
			<button
				onClick={toggleAccordion}
				className="w-full flex justify-between items-center p-4 bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors duration-200"
				aria-expanded={isOpen}
				aria-controls={`phrase-content-${id}`}
			>
				<span className="text-emerald-900 dark:text-emerald-100 font-medium">
					{phrase}
				</span>

				<PlusIcon
					className={`size-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${
						isOpen ? "rotate-[135deg]" : ""
					}`}
				/>
			</button>
			<div
				id={`phrase-content-${id}`}
				className={`transition-all duration-300 ease-in-out overflow-hidden ${
					isOpen ? "max-h-96" : "max-h-0"
				}`}
			>
				<div className="p-4 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
					<p className="font-semibold">
						Перевод: <span className="font-normal">{translation}</span>
					</p>
					<p className="font-semibold">
						Транскрипция: <span className="font-normal">{transcription}</span>
					</p>
				</div>
			</div>
		</div>
	);
}
