export type PackageStatus = 'active' | 'inactive' | 'draft';
export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'extreme';

export interface PackageImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface PackageAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  isRequired: boolean;
}

export interface PackageItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: number; // in days
  maxParticipants: number;
  minParticipants: number;
  difficulty: DifficultyLevel;
  status: PackageStatus;
  images: PackageImage[];
  addOns: PackageAddOn[];
  itinerary: PackageItinerary[];
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  location: string;
  meetingPoint: string;
  isPopular: boolean;
  isFeatured: boolean;
  availableDates: string[];
  unavailableDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageCreateRequest {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: number;
  maxParticipants: number;
  minParticipants: number;
  difficulty: DifficultyLevel;
  location: string;
  meetingPoint: string;
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  itinerary: Omit<PackageItinerary, 'id'>[];
  addOns: Omit<PackageAddOn, 'id'>[];
}

export interface PackageFilters {
  status?: PackageStatus[];
  difficulty?: DifficultyLevel[];
  priceRange?: {
    min: number;
    max: number;
  };
  search?: string;
}