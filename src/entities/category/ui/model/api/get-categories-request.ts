import { api } from "@/shared/api";
import { Category } from "@prisma/client/wasm";

export const getCategoriesRequest = async (): Promise<Category[]> => {
	const { data } = await api.get("/categories");
	return data;
};
