"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

type CategoryCardProps = {
	id: string;
	category: string;
	className?: string;
};

export function CategoryCard({ id, category, className }: CategoryCardProps) {
	return (
		<Link href={`/phrases/${id}`}>
			<div
				className={`bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm overflow-hidden ${className}`}
			>
				<div className="w-full flex justify-between items-center p-4 bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors duration-200">
					<span className="text-emerald-900 dark:text-emerald-100 font-medium">
						{category}
					</span>

					<ArrowRightIcon className="size-6 text-emerald-600 dark:text-emerald-400" />
				</div>
			</div>
		</Link>
	);
}
