import { apiClient } from "./client";
import queryString from "query-string";
import {
	Booking,
	BookingCreateRequest,
	BookingFilters,
	BookingUpdateRequest
} from "@/types/booking";
import { APIResponse } from "@/types/api";

export interface BookingsResponse {
	total: number;
	page: number;
	pages: number;
	limit: number;
}

export const bookingsApi = {
	createBooking: async (
		data: BookingCreateRequest
	): Promise<APIResponse<Booking>> => {
		try {
			return apiClient.post<APIResponse<Booking>>(
				"/bookings/create",
				data
			);
		} catch (error) {
			throw new Error("Failed to create package", { cause: error });
		}
	},

	getBookings: async (
		page = 1,
		limit = 10,
		filters?: BookingFilters
	): Promise<
		APIResponse<
			BookingsResponse & {
				docs: Booking[];
			}
		>
	> => {
		console.log("getting bookings");
		return apiClient.get<
			APIResponse<
				BookingsResponse & {
					docs: Booking[];
				}
			>
		>(
			`/bookings?${queryString.stringify({
				page: page.toString(),
				limit: limit.toString(),
				...filters
			})}`
		);
	},

	getBooking: async (id: string): Promise<APIResponse<Booking>> => {
		return apiClient.get<APIResponse<Booking>>(
			`/bookings/${id}?${queryString.stringify({
				invoice: true
			})}`
		);
	},

	updateBooking: async (
		id: string,
		data: BookingUpdateRequest
	): Promise<Booking> => {
		return apiClient.put<Booking>(`/bookings/${id}`, data);
	},

	cancelBooking: async (id: string, reason?: string): Promise<void> => {
		return apiClient.post<void>(`/bookings/${id}/cancel`, { reason });
	},

	confirmBooking: async (id: string): Promise<void> => {
		return apiClient.post<void>(`/bookings/${id}/confirm`);
	},

	generateInvoice: async (id: string): Promise<{ url: string }> => {
		return apiClient.post<{ url: string }>(`/bookings/${id}/invoice`);
	},

	reassignGuide: async (id: string, guide_id: string): Promise<void> => {
		return apiClient.post<void>(`/bookings/${id}/reassign-guide`, {
			guide_id
		});
	},

	bulkUpdate: async (
		ids: string[],
		data: BookingUpdateRequest
	): Promise<void> => {
		return apiClient.post<void>("/bookings/bulk-update", { ids, data });
	}
};
