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

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
	role: string;
}

export interface LoginResponse {
	user: {
		id: string;
		email: string;
		name: string;
		role: string;
		permissions: [];
		created_at: Date;
	};
	token: string;
	expires_at: Date;
}

export interface RegisterResponse {
	id: string;
	email: string;
	name: string;
	role: string;
	permissions: string[];
	created_at: Date;
}

export interface ResetPasswordRequest {
	email: string;
}
