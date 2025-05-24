import { PhraseList } from "@/features/phrase-list";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
	return (
		<div className="w-full h-screen">
			<Suspense
				fallback={
					<div className="w-full flex justify-center items-center h-screen">
						<Loader2Icon className="animate-spin text-emerald-600 h-20 w-20 dark:text-emerald-400" />
					</div>
				}
			>
				<PhraseList />
			</Suspense>
		</div>
	);
}
