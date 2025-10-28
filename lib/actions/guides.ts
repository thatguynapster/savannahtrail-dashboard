"use server";

import { revalidatePath } from "next/cache";
import { packagesApi } from "../api/packages";
import { routes } from "@/app/routes";
import { guidesApi } from "../api/guides";

export const createGuide = async (data: string) => {
	try {
		const dataObj = JSON.parse(data);

		const guide = await guidesApi.createGuide(dataObj);

		return guide;
	} catch (error) {
		console.log("Error creating guide:", error);
		throw error;
	} finally {
		revalidatePath(routes.guides.index, "page");
	}
};

export const updateGuide = async (data: string) => {
	try {
		const dataObj = JSON.parse(data);
		const { _id } = dataObj;

		// delete _id from dataObj to avoid redundancy
		delete dataObj._id;

		return await guidesApi.updateGuide(_id, dataObj);
	} catch (error) {
		console.log("Error creating package:", error);
		throw error;
	} finally {
		revalidatePath(routes.packages.index, "page");
	}
};

export const deleteGuide = async (id: string) => {
	try {
		return await guidesApi.deleteGuide(id);
	} catch (error) {
		console.log("Error deleting package:", error);
		throw error;
	} finally {
		revalidatePath(routes.packages.index, "page");
	}
};
