export type PackageStatus = "active" | "inactive" | "draft";

export interface PackageImage {
	id: string;
	url: string;
	alt: string;
	isPrimary: boolean;
}

export interface PackageAddOn {
	name: string;
	price: number;
}

export interface PackageItinerary {
	day: number;
	title: string;
	description: string;
	activities: string[];
}

export interface Package {
	_id: string;
	title: string;
	slug: string;
	description: string;
	base_price: number;
	guest_limit: number;
	extra_guest_fee: number;
	duration_hours: number;
	images: string[];
	addons: PackageAddOn[];
	available_dates: Date[];
	status: PackageStatus;
	created_at: string;
}

export interface PackageCreateRequest {
	title: string;
	slug: string;
	description: string;
	base_price: number;
	guest_limit: number;
	extra_guest_fee?: number;
	duration_hours: number;
	addons: PackageAddOn[];
}

export interface PackageFilters {
	status?: PackageStatus[];
	priceRange?: {
		min: number;
		max: number;
	};
	search?: string;
}
