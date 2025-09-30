export type APIResponse<T> = {
	success: boolean;
	code: number;
	responses: T;
	response: T;
	message: string;
};
