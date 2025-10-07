import { APIResponse } from "@/types/api";
import { apiClient } from "./client";

interface UploadImageRequest {
	files: File | File[];
	file_name: string;
	folder?: string;
}

interface UploadImageResponse {
	key: string;
	url: string;
	contentType: string;
}

export const imagesApi = {
	uploadSingleImage: async (
		file: File
	): Promise<APIResponse<UploadImageResponse>> => {
		try {
			return apiClient.upload<APIResponse<UploadImageResponse>>(
				`/extensions/file/upload`,
				file
			);
		} catch (error) {
			throw new Error("Failed to upload image", { cause: error });
		}
	},

	uploadMultipleImages: async (
		images: File[]
	): Promise<APIResponse<UploadImageResponse>[]> => {
		try {
			const uploadPromise = images.map((image) =>
				apiClient.upload<APIResponse<UploadImageResponse>>(
					"/extensions/file/upload-multiple",
					image
				)
			);

			return await Promise.all(uploadPromise);
		} catch (error) {
			throw new Error("Failed to upload image", { cause: error });
		}
	},

	deleteImage: async (id: string, imageId: string): Promise<void> => {
		return apiClient.delete<void>(`/packages/${id}/images/${imageId}`);
	}
};
