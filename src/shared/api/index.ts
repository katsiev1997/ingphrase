import axios from "axios";

const getBaseURL = () => {
	if (typeof window !== "undefined") {
		// Клиентская сторона
		return "/api";
	}
	// Серверная сторона
	return process.env.NODE_ENV === "production"
		? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
		: "http://localhost:3000/api";
};

export const api = axios.create({
	baseURL: getBaseURL(),
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
