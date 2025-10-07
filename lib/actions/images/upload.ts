"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";

export const UploadSingleImage = async (data: string) => {
	try {
		const dataObj = JSON.parse(data);
		console.log("Upload image:", dataObj);

		// const tourPackage = await packagesApi.createPackage(dataObj);
		// console.log("Created package:", tourPackage);

		// return tourPackage;
		return {};
	} catch (error) {
		console.log("Error creating package:", error);
		throw error;
	} finally {
		revalidatePath(routes.packages.index, "page");
	}
};

// export const uploadMultipleImages=async()
