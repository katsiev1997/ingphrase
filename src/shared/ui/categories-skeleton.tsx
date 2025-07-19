import { Skeleton } from "./skeleton";

export function CategoriesSkeleton() {
	return (
		<div className="flex flex-col gap-4 px-4 py-6 overflow-y-auto">
			{Array.from({ length: 6 }).map((_, index) => (
				<div
					key={index}
					className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm overflow-hidden"
				>
					<div className="w-full flex justify-between items-center p-4 bg-emerald-100 dark:bg-emerald-900">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-6 w-6 rounded" />
					</div>
				</div>
			))}
		</div>
	);
}
