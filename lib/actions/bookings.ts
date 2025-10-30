"use server";

import { revalidatePath } from "next/cache";
import { packagesApi } from "../api/packages";
import { routes } from "@/app/routes";
import { bookingsApi } from "../api/bookings";

export const createBooking = async (data: string) => {
	try {
		const dataObj = JSON.parse(data);

		return await bookingsApi.createBooking(dataObj);
	} catch (error) {
		console.log("Error creating package:", error);
		throw error;
	} finally {
		revalidatePath(routes.bookings.index, "page");
	}
};
