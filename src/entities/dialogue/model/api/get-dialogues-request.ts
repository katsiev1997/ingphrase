import { api } from "@/shared/api";

export interface Dialogue {
	id: number;
	title: string;
	audioUrl?: string;
	messages: Message[];
	createdAt: string;
	updatedAt: string;
}

export interface Message {
	id: number;
	originalText: string;
	translatedText: string;
	dialogueId: number;
	createdAt: string;
	updatedAt: string;
}

export const getDialoguesRequest = async (): Promise<Dialogue[]> => {
	const response = await api.get<Dialogue[]>("/dialogs");
	return response.data;
};
