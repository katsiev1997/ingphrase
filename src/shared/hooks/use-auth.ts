import { useState, useEffect } from "react";
import { api } from "@/shared/api";

interface UserData {
	id: number;
	email: string;
	role: "ADMIN" | "MODERATOR" | "USER";
}

interface AuthResponse {
	authenticated: boolean;
	user: UserData | null;
}

export const useAuth = () => {
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);

	const checkAuth = async () => {
		try {
			const { data } = await api.get<AuthResponse>("/auth");

			if (data.authenticated && data.user) {
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Auth check error:", error);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await api.post("/auth/logout");
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const isModeratorOrAdmin = () => {
		return user?.role === "ADMIN" || user?.role === "MODERATOR";
	};

	useEffect(() => {
		checkAuth();
	}, []);

	return {
		user,
		loading,
		isAuthenticated: !!user,
		isModeratorOrAdmin: isModeratorOrAdmin(),
		refetch: checkAuth,
		logout,
	};
};
