export type APIResponse<T> = {
	success: boolean;
	code: number;
	responses: T;
	message: string;
};
