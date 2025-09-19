import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiClient {
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const token = Cookies.get("auth-token");

		const config: RequestInit = {
			...options,
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
				...options.headers
			}
		};

		const response = await fetch(`${this.baseURL}${endpoint}`, config);

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "Network error" }));
			throw new Error(error.message || `HTTP ${response.status}`);
		}

		return response.json();
	}

	async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: "GET" });
	}

	async post<T>(endpoint: string, data?: any): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined
		});
	}

	async put<T>(endpoint: string, data?: any): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined
		});
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: "DELETE" });
	}

	async upload<T>(endpoint: string, file: File): Promise<T> {
		const token = Cookies.get("auth-token");
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${this.baseURL}${endpoint}`, {
			method: "POST",
			headers: {
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: formData
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "Upload failed" }));
			throw new Error(error.message || `HTTP ${response.status}`);
		}

		return response.json();
	}
}

export const apiClient = new ApiClient(API_BASE_URL);
