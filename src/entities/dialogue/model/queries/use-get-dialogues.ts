import { useQuery } from "@tanstack/react-query";
import { getDialoguesRequest } from "../api/get-dialogues-request";

export const useGetDialogues = () => {
	return useQuery({
		queryKey: ["dialogues"],
		queryFn: getDialoguesRequest,
	});
};
