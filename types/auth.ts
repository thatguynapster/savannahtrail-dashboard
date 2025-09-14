export type UserRole =
	| "admin"
	| "tour_guide"
	| "operations"
	| "finance"
	| "support";

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	permissions: string[];
	avatar?: string;
	isActive: boolean;
	lastLogin?: string;
	createdAt: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	user: User;
	token: string;
}

export interface ResetPasswordRequest {
	email: string;
}
