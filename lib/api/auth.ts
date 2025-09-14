import { apiClient } from "./client";
import {
	User,
	LoginRequest,
	LoginResponse,
	ResetPasswordRequest
} from "@/types/auth";

export const authApi = {
	login: async (email: string, password: string): Promise<LoginResponse> => {
		return apiClient.post<LoginResponse>("/auth/login", {
			email,
			password
		});
	},

	logout: async (): Promise<void> => {
		return apiClient.post<void>("/auth/logout");
	},

	getProfile: async (): Promise<User> => {
		return apiClient.get<User>("/auth/profile");
	},

	resetPassword: async (email: string): Promise<void> => {
		return apiClient.post<void>("/auth/reset-password", { email });
	},

	changePassword: async (
		currentPassword: string,
		newPassword: string
	): Promise<void> => {
		return apiClient.post<void>("/auth/change-password", {
			currentPassword,
			newPassword
		});
	}
};
