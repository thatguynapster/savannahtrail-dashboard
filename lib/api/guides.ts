import {
	Guide,
	GuideCreateRequest,
	GuideFilters,
	GuideAvailability
} from "@/types/guide";
import { apiClient } from "./client";
import { APIResponse } from "@/types/api";
import queryString from "query-string";

export interface GuidesResponse {
	// guides: Guide[];
	total: number;
	page: number;
	pages: number;
	limit: number;
}

export const guidesApi = {
	getGuides: async (
		page = 0,
		limit = 10,
		filters?: GuideFilters
	): Promise<APIResponse<GuidesResponse & { docs: Guide[] }>> => {
		try {
			return apiClient.get<
				APIResponse<GuidesResponse & { docs: Guide[] }>
			>(
				`/guides?${queryString.stringify({
					page,
					limit,
					...filters
				})}`
			);
		} catch (error) {
			throw new Error("Failed to fetch guides", { cause: error });
		}
	},

	getGuide: async (id: string): Promise<APIResponse<Guide>> => {
		return apiClient.get<APIResponse<Guide>>(`/guides/get-guide/${id}`);
	},

	createGuide: async (
		data: GuideCreateRequest
	): Promise<APIResponse<Guide>> => {
		return apiClient.post<APIResponse<Guide>>("/guides", data);
	},

	updateGuide: async (
		id: string,
		data: Partial<GuideCreateRequest>
	): Promise<APIResponse<Guide>> => {
		return apiClient.put<APIResponse<Guide>>(`/guides/${id}`, data);
	},

	deleteGuide: async (id: string): Promise<void> => {
		return apiClient.delete<void>(`/guides/${id}`);
	},

	updateStatus: async (id: string, status: string): Promise<void> => {
		return apiClient.post<void>(`/guides/${id}/status`, { status });
	},

	getAvailability: async (
		id: string,
		month: string
	): Promise<APIResponse<GuideAvailability[]>> => {
		return apiClient.get<APIResponse<GuideAvailability[]>>(
			`/guides/${id}/availability?month=${month}`
		);
	},

	updateAvailability: async (
		id: string,
		dates: GuideAvailability[]
	): Promise<void> => {
		return apiClient.post<void>(`/guides/${id}/availability`, { dates });
	}
};
