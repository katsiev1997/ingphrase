"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getPhrasesRequest } from "../api/get-phrases-request";

export const useGetPhrases = () => {
	const searchParams = useSearchParams();

	const id = searchParams.get("id");
	console.log({ id });
	return useQuery({
		queryKey: ["phrases", id],
		queryFn: () => getPhrasesRequest(Number(id) || 1),
	});
};
