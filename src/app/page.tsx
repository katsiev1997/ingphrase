import { CategoriesList } from "@/features/category-list";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
	return (
		<div className="w-full h-full pb-[100px]">
			<Suspense
				fallback={
					<div className="w-full flex justify-center items-center h-full">
						<Loader2Icon className="animate-spin text-emerald-600 h-20 w-20 dark:text-emerald-400" />
					</div>
				}
			>
				<CategoriesList />
			</Suspense>
		</div>
	);
}
