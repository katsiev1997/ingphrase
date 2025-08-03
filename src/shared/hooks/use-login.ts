import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";

interface LoginData {
	email: string;
}

interface LoginResponse {
	success: boolean;
	message: string;
	user: {
		id: number;
		email: string;
		role: "ADMIN" | "MODERATOR" | "USER";
	};
}

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: LoginData): Promise<LoginResponse> => {
			const response = await api.post<LoginResponse>("/auth/login", data);
			return response.data;
		},
		onSuccess: () => {
			// Инвалидируем кеш аутентификации после успешного логина
			queryClient.invalidateQueries({ queryKey: ["auth"] });
		},
	});
};
