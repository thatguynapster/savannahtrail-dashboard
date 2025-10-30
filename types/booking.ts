import { Package } from "./package";

export type BookingStatus =
	| "pending"
	| "confirmed"
	| "cancelled"
	| "completed"
	| "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Customer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	nationality: string;
}

export interface BookingCreateRequest {
	package_id: string;
	guest_name: string;
	guest_phone: string;
	guest_email: string;
	tour_date: Date;
	num_guests: number;
	addons: {
		name: string;
		price: number;
	}[];
	redirect_url: string;
}

export interface Booking {
	_id: string;
	package_id: string;
	package?: Package;
	guest_name: string;
	guest_phone: string;
	guest_email: string;
	tour_date: Date;
	num_guests: number;
	addons: {
		name: string;
		price: number;
	}[];
	redirect_url: string;
	created_at: Date;
	booking_status: "pending" | "confirmed" | "cancelled" | "completed";
	assigned_guide_id: string | null;
	total_amount: number;
}

export interface BookingAddOn {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

export interface BookingFilters {
	status?: BookingStatus[];
	paymentStatus?: PaymentStatus[];
	dateRange?: {
		start: string;
		end: string;
	};
	guideId?: string;
	packageId?: string;
	search?: string;
}

export interface BookingUpdateRequest {
	status?: BookingStatus;
	guideId?: string;
	specialRequests?: string;
}
