"use client";

import { useQuery } from "@tanstack/react-query";

import { getPhrasesRequest } from "../api/get-phrases-request";

export const useGetPhrases = (categoryId: string) => {
	return useQuery({
		queryKey: ["phrases", categoryId],
		queryFn: () => getPhrasesRequest(Number(categoryId) || 1),
	});
};
