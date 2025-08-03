import { api } from "@/shared/api";

export interface CreateDialogueData {
	title: string;
	messages: {
		originalText: string;
		translatedText: string;
	}[];
}

export interface CreateDialogueResponse {
	success: boolean;
	dialogue: {
		id: number;
		title: string;
		audioUrl?: string;
		messages: {
			id: number;
			originalText: string;
			translatedText: string;
			dialogueId: number;
			createdAt: string;
			updatedAt: string;
		}[];
		createdAt: string;
		updatedAt: string;
	};
}

export const createDialogueRequest = async (
	data: CreateDialogueData
): Promise<CreateDialogueResponse> => {
	const response = await api.post<CreateDialogueResponse>("/dialogs", data);
	return response.data;
};
