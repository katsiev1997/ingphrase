import { PhraseList } from "@/features/phrase-list";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	params: Promise<{
		categoryId: string;
	}>;
};

export default async function Home({ params }: Props) {
	const categoryId = (await params).categoryId;

	return (
		<div className="w-full">
			<Suspense
				fallback={
					<div className="w-full flex justify-center items-center h-full">
						<Loader2Icon className="animate-spin text-emerald-600 h-20 w-20 dark:text-emerald-400" />
					</div>
				}
			>
				<Link href="/" className="text-emerald-600 dark:text-emerald-400 mx-4">
					<div className="w-52 mx-5 flex items-center gap-2 text-sm border border-emerald-600 dark:border-emerald-400 rounded-md px-4 py-2">
						<ArrowLeftIcon />
						<p>Вернуться назад</p>
					</div>
				</Link>
				<PhraseList categoryId={categoryId} />
			</Suspense>
		</div>
	);
}
