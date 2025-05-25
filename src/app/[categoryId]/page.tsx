import { PhraseList } from "@/features/phrase-list";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

type Props = {
	params: Promise<{
		categoryId: string;
	}>;
};

export default async function Home({ params }: Props) {
	const categoryId = (await params).categoryId;

	return (
		<div className="w-full h-full">
			<Suspense
				fallback={
					<div className="w-full flex justify-center items-center h-full">
						<Loader2Icon className="animate-spin text-emerald-600 h-20 w-20 dark:text-emerald-400" />
					</div>
				}
			>
				<PhraseList categoryId={categoryId} />
			</Suspense>
		</div>
	);
}
