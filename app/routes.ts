export const routes = {
	dashboard: "/dashboard",
	packages: {
		index: "/packages",
		new: "/packages/new",
		view: (id: string) => `/packages/${id}`,
		edit: (id: string) => `/packages/${id}/edit`
	},
	bookings: {
		index: "/bookings",
		view: (id: string) => `/bookings/${id}`
	},
	guides: {
		index: "/guides",
		new: "/guides/new",
		view: (id: string) => `/guides/${id}`,
		edit: (id: string) => `/guides/${id}/edit`
	},
	payments: "/payments",
	settings: "/settings"
};
