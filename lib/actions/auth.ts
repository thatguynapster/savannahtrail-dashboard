"use server";

import { routes } from "@/app/routes";
import { authApi } from "../api/auth";

export const loginUser = async (data: string) => {
	try {
		const dataObj = JSON.parse(data);
		console.log("Logging in user with data:", dataObj);

		const user = await authApi.login(dataObj);
		console.log("Logged in user:", user);

		return user;
	} catch (error) {
		console.log("Error logging in:", error);
		throw error;
	}
};

export const createUser = async (data: string) => {
	try {
		const dataObj = JSON.parse(data);
		console.log("Creating user with data:", dataObj);

		const user = await authApi.createUser(dataObj);
		console.log("Created user:", user);

		return user;
	} catch (error) {
		console.log("Error creating user:", error);
		throw error;
	}
};
