import { APIResponse } from "@/types/api";
import { apiClient } from "./client";
import { Package, PackageCreateRequest, PackageFilters } from "@/types/package";
import queryString from "query-string";

export interface PackagesResponse {
	packages: Package[];
	total: number;
	page: number;
	pages: number;
	limit: number;
}

export const packagesApi = {
	getPackages: async (
		page = 1,
		limit = 10,
		filters?: PackageFilters
	): Promise<APIResponse<PackagesResponse & { docs: Package[] }>> => {
		try {
			return apiClient.get<
				APIResponse<PackagesResponse & { docs: Package[] }>
			>(
				`/packages?${queryString.stringify({
					page: page.toString(),
					limit: limit.toString(),
					...filters
				})}`
			);
		} catch (error) {
			throw new Error("Failed to fetch packages", { cause: error });
		}
	},

	getPackage: async (id: string): Promise<APIResponse<Package>> => {
		try {
			return apiClient.get<APIResponse<Package>>(`/packages/${id}`);
		} catch (error) {
			throw new Error("Failed to fetch package", { cause: error });
		}
	},

	createPackage: async (data: PackageCreateRequest): Promise<Package> => {
		try {
			return apiClient.post<Package>("/packages/create", data);
		} catch (error) {
			throw new Error("Failed to create package", { cause: error });
		}
	},

	updatePackage: async (
		id: string,
		data: Partial<PackageCreateRequest>
	): Promise<Package> => {
		try {
			return apiClient.put<Package>(`/packages/${id}`, data);
		} catch (error) {
			throw new Error("Failed to update package", { cause: error });
		}
	},

	deletePackage: async (id: string): Promise<void> => {
		try {
			return apiClient.delete<void>(`/packages/${id}`);
		} catch (error) {
			throw new Error("Failed to delete package", { cause: error });
		}
	},

	updateAvailability: async (id: string, dates: string[]): Promise<void> => {
		try {
			return apiClient.post<void>(`/packages/${id}/availability`, {
				dates
			});
		} catch (error) {
			throw new Error("Failed to update availability", { cause: error });
		}
	}
};
