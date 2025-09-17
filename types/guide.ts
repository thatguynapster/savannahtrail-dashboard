export type GuideStatus = 'active' | 'inactive' | 'on_leave';

export interface GuideAvailability {
  date: string;
  isAvailable: boolean;
  bookingId?: string;
  packageName?: string;
}

export interface Guide {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  experience: number; // years
  languages: string[];
  specialties: string[];
  status: GuideStatus;
  avatar?: string;
  rating: number;
  totalTours: number;
  joinedAt: string;
  availability: GuideAvailability[];
  certifications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface GuideCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  experience: number;
  languages: string[];
  specialties: string[];
  certifications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface GuideFilters {
  status?: GuideStatus[];
  languages?: string[];
  specialties?: string[];
  experienceRange?: {
    min: number;
    max: number;
  };
  search?: string;
}