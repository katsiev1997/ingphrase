import { api } from "@/shared/api";
import { Category } from "@prisma/client/wasm";
import { AxiosError } from "axios";

export const getCategoriesRequest = async (): Promise<Category[]> => {
	try {
		const { data } = await api.get("/categories");
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(error.response?.data.message);
		}
		throw error;
	}
};
