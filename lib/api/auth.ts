import { APIResponse } from "@/types/api";
import { apiClient } from "./client";
import { Package, PackageCreateRequest, PackageFilters } from "@/types/package";
import queryString from "query-string";
import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse
} from "@/types/auth";

export const authApi = {
	login: async (data: LoginRequest): Promise<APIResponse<LoginResponse>> => {
		try {
			return apiClient.post<APIResponse<LoginResponse>>(
				`/auth/login`,
				data
			);
		} catch (error) {
			throw new Error("Failed to fetch packages", { cause: error });
		}
	},

	createUser: async (
		data: RegisterRequest
	): Promise<APIResponse<RegisterResponse>> => {
		try {
			return apiClient.post<APIResponse<RegisterResponse>>(
				"/auth/create-user",
				data
			);
		} catch (error) {
			throw new Error("Failed to create package", { cause: error });
		}
	}
};
