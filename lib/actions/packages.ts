"use server";

import { revalidatePath } from "next/cache";
import { packagesApi } from "../api/packages";
import { routes } from "@/app/routes";

export const createTourPackage = async (data: string) => {
	try {
		const dataObj = JSON.parse(data);
		console.log("Creating package with data:", dataObj);

		const tourPackage = await packagesApi.createPackage(dataObj);
		console.log("Created package:", tourPackage);

		return tourPackage;
	} catch (error) {
		console.log("Error creating package:", error);
		throw error;
	} finally {
		revalidatePath(routes.packages.index, "page");
	}
};

export const getTourPackages = async (page = 1, limit = 10, filters?: any) => {
	try {
	} catch (error) {
		console.log("Error fetching packages:", error);
		throw error;
	}
};
