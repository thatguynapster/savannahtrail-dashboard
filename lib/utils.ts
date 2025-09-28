import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseCurrency(amount: number) {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS"
	}).format(amount);
}

export function makeSlug(val: string) {
	// slug should be lowercase, replace spaces with dashes, and remove special characters
	const newVal = val
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^a-z0-9-]/g, "") // Remove special characters
		.replace(/-{2,}/g, "-") // Replace consecutive hyphens with single hyphen
		.replace(/^-+/, "") // Remove leading hyphens
		.replace(/-+$/, "");

	return newVal.substring(0, 50);
}
