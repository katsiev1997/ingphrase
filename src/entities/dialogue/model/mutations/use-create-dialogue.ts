import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDialogueRequest } from "../api/create-dialogue-request";

export const useCreateDialogue = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createDialogueRequest,
		onSuccess: () => {
			// Инвалидируем кеш диалогов
			queryClient.invalidateQueries({
				queryKey: ["dialogues"],
			});
		},
	});
};
