export type GuideStatus = "active" | "inactive" | "on_leave";

export interface GuideAvailability {
	date: string;
	// available: boolean;
	// blocked_reason: string;
}

export interface Guide {
	_id: string;
	name: string;
	email: string;
	phone: string;
	bio: string;
	photo_url: string;
	languages: string[];
	specialties: string[];
	status: GuideStatus;
	availability: GuideAvailability[];
	created_at: Date;

	// id: string;
	// firstName: string;
	// lastName: string;
	// email: string;
	// phone: string;
	// bio: string;
	// experience: number; // years
	// languages: string[];
	// specialties: string[];
	// status: GuideStatus;
	// rating: number;
	// totalTours: number;
	// certifications: string[];
	// emergencyContact: {
	//   name: string;
	//   phone: string;
	//   relationship: string;
	// };
}

export interface GuideCreateRequest {
	name: string;
	email: string;
	phone: string;
	bio: string;
	photo_url: string;
	languages: string[];
	specialties: string[];
	status: GuideStatus;
	availability: GuideAvailability[];
}

export interface GuideFilters {
	status?: GuideStatus;
	languages?: string[];
	specialties?: string[];
	search?: string;
}
