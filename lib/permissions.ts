import { UserRole } from "@/types/auth";

export const PERMISSIONS = {
	// Dashboard
	VIEW_DASHBOARD: "view_dashboard",

	// Bookings
	VIEW_BOOKINGS: "view_bookings",
	EDIT_BOOKINGS: "edit_bookings",
	CANCEL_BOOKINGS: "cancel_bookings",
	REASSIGN_GUIDES: "reassign_guides",
	GENERATE_INVOICES: "generate_invoices",

	// Packages
	VIEW_PACKAGES: "view_packages",
	CREATE_PACKAGES: "create_packages",
	EDIT_PACKAGES: "edit_packages",
	DELETE_PACKAGES: "delete_packages",
	MANAGE_PACKAGE_AVAILABILITY: "manage_package_availability",

	// Guides
	VIEW_GUIDES: "view_guides",
	CREATE_GUIDES: "create_guides",
	EDIT_GUIDES: "edit_guides",
	DELETE_GUIDES: "delete_guides",
	MANAGE_GUIDE_AVAILABILITY: "manage_guide_availability",

	// Payments
	VIEW_PAYMENTS: "view_payments",
	RETRY_PAYMENTS: "retry_payments",
	PROCESS_REFUNDS: "process_refunds",

	// Alerts & Audit
	VIEW_ALERTS: "view_alerts",
	MANAGE_ALERTS: "manage_alerts",
	VIEW_AUDIT_LOGS: "view_audit_logs",

	// Settings
	VIEW_SETTINGS: "view_settings",
	EDIT_SETTINGS: "edit_settings",
	MANAGE_USERS: "manage_users"
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
	admin: Object.values(PERMISSIONS),

	tour_guide: [
		PERMISSIONS.VIEW_DASHBOARD,
		PERMISSIONS.VIEW_BOOKINGS,
		PERMISSIONS.MANAGE_GUIDE_AVAILABILITY
	],

	operations: [
		PERMISSIONS.VIEW_DASHBOARD,
		PERMISSIONS.VIEW_BOOKINGS,
		PERMISSIONS.EDIT_BOOKINGS,
		PERMISSIONS.REASSIGN_GUIDES,
		PERMISSIONS.VIEW_PACKAGES,
		PERMISSIONS.EDIT_PACKAGES,
		PERMISSIONS.VIEW_GUIDES,
		PERMISSIONS.EDIT_GUIDES,
		PERMISSIONS.MANAGE_GUIDE_AVAILABILITY,
		PERMISSIONS.VIEW_ALERTS
	],

	finance: [
		PERMISSIONS.VIEW_DASHBOARD,
		PERMISSIONS.VIEW_BOOKINGS,
		PERMISSIONS.GENERATE_INVOICES,
		PERMISSIONS.VIEW_PAYMENTS,
		PERMISSIONS.RETRY_PAYMENTS,
		PERMISSIONS.PROCESS_REFUNDS,
		PERMISSIONS.VIEW_ALERTS,
		PERMISSIONS.VIEW_AUDIT_LOGS
	],

	support: [
		PERMISSIONS.VIEW_DASHBOARD,
		PERMISSIONS.VIEW_BOOKINGS,
		PERMISSIONS.EDIT_BOOKINGS,
		PERMISSIONS.VIEW_PACKAGES,
		PERMISSIONS.VIEW_GUIDES,
		PERMISSIONS.VIEW_ALERTS,
		PERMISSIONS.MANAGE_ALERTS
	]
};

export function getUserPermissions(role: UserRole): string[] {
	return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
	return (
		ROLE_PERMISSIONS[userRole]?.includes(permission) || userRole === "admin"
	);
}
