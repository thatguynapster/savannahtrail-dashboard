import { apiClient } from "./client";
import queryString from "query-string";
import { Booking, BookingFilters, BookingUpdateRequest } from "@/types/booking";

export interface BookingsResponse {
	bookings: Booking[];
	total: number;
	page: number;
	limit: number;
}

export const bookingsApi = {
	getBookings: async (
		page = 1,
		limit = 10,
		filters?: BookingFilters
	): Promise<BookingsResponse> => {
		console.log("getting bookings");
		return apiClient.get<BookingsResponse>(
			`/bookings?${queryString.stringify({
				page: page.toString(),
				limit: limit.toString(),
				...filters
			})}`
		);
	},

	getBooking: async (id: string): Promise<Booking> => {
		return apiClient.get<Booking>(`/bookings/${id}`);
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

	reassignGuide: async (id: string, guideId: string): Promise<void> => {
		return apiClient.post<void>(`/bookings/${id}/reassign`, { guideId });
	},

	bulkUpdate: async (
		ids: string[],
		data: BookingUpdateRequest
	): Promise<void> => {
		return apiClient.post<void>("/bookings/bulk-update", { ids, data });
	}
};
