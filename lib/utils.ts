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

export async function uploadFiles(formData: FormData) {
	console.log("data to upload:", formData);

	try {
		const uploadedImages = await fetch(
			`${process.env["NEXT_PUBLIC_API_BASE_URL"]}/extensions/file/upload-multiple`,
			{
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "*"
				},
				body: formData,
				redirect: "follow"
			}
		)
			.then((resp) => resp.json())
			.then((res) => res.responses.map((img: any) => img.url))
			.catch((error) => {
				console.log("Error uploading files:", error);
				throw error;
			});

		return uploadedImages;
	} catch (error) {
		console.log("Failed to upload files");
		throw new Error("Failed to upload files", { cause: error });
	}
}
