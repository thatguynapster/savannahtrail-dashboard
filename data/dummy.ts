import { Alert, AuditLog } from "@/types/alert";
import { User } from "@/types/auth";
import { Booking } from "@/types/booking";
import { Guide } from "@/types/guide";
import { Notification } from "@/types/notification";
import { Package } from "@/types/package";
import { PaymentEvent } from "@/types/payment";

export const mockUsers: User[] = [
	{
		id: "USR001",
		email: "admin@savannahtrail.com",
		firstName: "Admin",
		lastName: "User",
		role: "admin",
		permissions: [],
		avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
		isActive: true,
		lastLogin: "2024-01-19T10:30:00Z",
		createdAt: "2023-01-01T00:00:00Z"
	},
	{
		id: "USR002",
		email: "guide@savannahtrail.com",
		firstName: "Sarah",
		lastName: "Johnson",
		role: "tour_guide",
		permissions: [],
		avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
		isActive: true,
		lastLogin: "2024-01-19T08:15:00Z",
		createdAt: "2023-03-15T00:00:00Z"
	}
];

export const mockPackages: Package[] = [
	{
		id: "PKG001",
		name: "Safari Adventure",
		slug: "safari-adventure",
		description:
			"Experience the wild beauty of Ghana with our comprehensive safari tour.",
		shortDescription: "Wildlife safari with professional guides",
		price: 600,
		duration: 3,
		maxParticipants: 8,
		minParticipants: 2,
		difficulty: "moderate",
		status: "active",
		images: [],
		addOns: [],
		itinerary: [],
		inclusions: ["Transportation", "Meals", "Guide"],
		exclusions: ["Personal expenses"],
		requirements: ["Valid passport"],
		location: "Mole National Park",
		meetingPoint: "Tamale Airport",
		isPopular: true,
		isFeatured: true,
		availableDates: [],
		unavailableDates: [],
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-15T00:00:00Z"
	},
	{
		id: "PKG002",
		name: "Cultural Heritage Tour",
		slug: "cultural-heritage-tour",
		description:
			"Discover the rich cultural heritage of Ghana through historical sites.",
		shortDescription: "Historical and cultural exploration",
		price: 400,
		duration: 2,
		maxParticipants: 12,
		minParticipants: 4,
		difficulty: "easy",
		status: "active",
		images: [],
		addOns: [],
		itinerary: [],
		inclusions: ["Transportation", "Guide", "Entry fees"],
		exclusions: ["Meals", "Accommodation"],
		requirements: [],
		location: "Cape Coast",
		meetingPoint: "Cape Coast Castle",
		isPopular: false,
		isFeatured: false,
		availableDates: [],
		unavailableDates: [],
		createdAt: "2024-01-05T00:00:00Z",
		updatedAt: "2024-01-10T00:00:00Z"
	}
];

export const mockBookings: Booking[] = [
	{
		id: "BK001",
		packageId: "PKG001",
		packageName: "Safari Adventure",
		customer: {
			id: "CUST001",
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			phone: "+233 24 123 4567",
			nationality: "American"
		},
		guideId: "GD001",
		guideName: "Sarah Johnson",
		startDate: "2024-02-15",
		endDate: "2024-02-18",
		participants: 4,
		totalAmount: 2400,
		paidAmount: 2400,
		status: "confirmed",
		paymentStatus: "paid",
		specialRequests: "Vegetarian meals required",
		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-16T14:20:00Z",
		addOns: []
	},
	{
		id: "BK002",
		packageId: "PKG002",
		packageName: "Cultural Heritage Tour",
		customer: {
			id: "CUST002",
			firstName: "Emma",
			lastName: "Wilson",
			email: "emma.wilson@email.com",
			phone: "+233 20 987 6543",
			nationality: "British"
		},
		startDate: "2024-02-20",
		endDate: "2024-02-22",
		participants: 2,
		totalAmount: 1200,
		paidAmount: 600,
		status: "pending",
		paymentStatus: "pending",
		createdAt: "2024-01-18T09:15:00Z",
		updatedAt: "2024-01-18T09:15:00Z",
		addOns: []
	}
];

export const mockGuides: Guide[] = [
	{
		id: "GD001",
		firstName: "Sarah",
		lastName: "Johnson",
		email: "sarah.johnson@savannahtrail.com",
		phone: "+233 24 123 4567",
		bio: "Experienced wildlife guide with 8 years in the field. Specializes in bird watching and photography tours.",
		experience: 8,
		languages: ["English", "Twi", "French"],
		specialties: [
			"Wildlife Photography",
			"Bird Watching",
			"Cultural Tours"
		],
		status: "active",
		avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
		rating: 4.9,
		totalTours: 156,
		joinedAt: "2020-03-15T00:00:00Z",
		availability: [],
		certifications: ["Wildlife Guide Certification", "First Aid Certified"],
		emergencyContact: {
			name: "Michael Johnson",
			phone: "+233 20 987 6543",
			relationship: "Spouse"
		}
	},
	{
		id: "GD002",
		firstName: "Kwame",
		lastName: "Asante",
		email: "kwame.asante@savannahtrail.com",
		phone: "+233 26 789 0123",
		bio: "Cultural heritage specialist with deep knowledge of Ghanaian history and traditions.",
		experience: 12,
		languages: ["English", "Twi", "Ga", "Ewe"],
		specialties: [
			"Cultural Heritage",
			"Historical Sites",
			"Traditional Crafts"
		],
		status: "active",
		avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
		rating: 4.8,
		totalTours: 203,
		joinedAt: "2018-07-22T00:00:00Z",
		availability: [],
		certifications: [
			"Cultural Guide Certification",
			"Tourism Board License"
		],
		emergencyContact: {
			name: "Akosua Asante",
			phone: "+233 24 456 7890",
			relationship: "Sister"
		}
	},
	{
		id: "GD003",
		firstName: "Fatima",
		lastName: "Abdul",
		email: "fatima.abdul@savannahtrail.com",
		phone: "+233 27 345 6789",
		bio: "Adventure tour specialist focusing on hiking and outdoor activities in northern Ghana.",
		experience: 5,
		languages: ["English", "Hausa", "Dagbani"],
		specialties: ["Adventure Tours", "Hiking", "Northern Ghana"],
		status: "on_leave",
		avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
		rating: 4.7,
		totalTours: 89,
		joinedAt: "2021-11-10T00:00:00Z",
		availability: [],
		certifications: [
			"Adventure Guide Certification",
			"Mountain Safety Course"
		],
		emergencyContact: {
			name: "Ibrahim Abdul",
			phone: "+233 20 123 4567",
			relationship: "Father"
		}
	}
];

export const mockPaymentEvents: PaymentEvent[] = [
	{
		id: "PAY001",
		bookingId: "BK001",
		customerName: "John Doe",
		amount: 2400,
		method: "card",
		type: "payment_success",
		status: "completed",
		reference: "PAY_001_SUCCESS",
		timestamp: "2024-01-16T14:20:00Z",
		metadata: { cardLast4: "4242", cardBrand: "visa" }
	},
	{
		id: "PAY002",
		bookingId: "BK002",
		customerName: "Emma Wilson",
		amount: 600,
		method: "mobile_money",
		type: "payment_failed",
		status: "failed",
		reference: "PAY_002_FAILED",
		timestamp: "2024-01-18T09:30:00Z",
		metadata: { errorCode: "INSUFFICIENT_FUNDS", provider: "MTN" }
	},
	{
		id: "PAY003",
		bookingId: "BK003",
		customerName: "Michael Brown",
		amount: 1800,
		method: "bank_transfer",
		type: "payment_initiated",
		status: "pending",
		reference: "PAY_003_PENDING",
		timestamp: "2024-01-19T11:15:00Z",
		metadata: { bankName: "GCB Bank", accountNumber: "****1234" }
	}
];

export const mockAlerts: Alert[] = [
	{
		id: "ALT001",
		type: "error",
		priority: "high",
		status: "active",
		title: "Payment Gateway Error",
		message: "Multiple payment failures detected for Paystack integration",
		source: "payment_system",
		timestamp: "2024-01-19T10:30:00Z",
		metadata: { errorCount: 5, affectedBookings: ["BK001", "BK002"] },
		actions: [
			{
				id: "retry_payments",
				label: "Retry Failed Payments",
				type: "primary",
				endpoint: "/api/payments/retry-failed",
				method: "POST"
			}
		]
	},
	{
		id: "ALT002",
		type: "warning",
		priority: "medium",
		status: "active",
		title: "Guide Availability Low",
		message: "Only 2 guides available for upcoming weekend bookings",
		source: "scheduling_system",
		timestamp: "2024-01-19T08:15:00Z",
		metadata: { availableGuides: 2, requiredGuides: 5 },
		actions: [
			{
				id: "contact_guides",
				label: "Contact Backup Guides",
				type: "secondary",
				endpoint: "/api/guides/contact-backup",
				method: "POST"
			}
		]
	},
	{
		id: "ALT003",
		type: "info",
		priority: "low",
		status: "dismissed",
		title: "System Maintenance Scheduled",
		message: "Scheduled maintenance window for Sunday 2AM-4AM GMT",
		source: "system",
		timestamp: "2024-01-18T16:00:00Z",
		dismissedAt: "2024-01-19T09:00:00Z"
	}
];

export const mockAuditLogs: AuditLog[] = [
	{
		id: "LOG001",
		userId: "USR001",
		userName: "Admin User",
		action: "UPDATE_BOOKING_STATUS",
		resource: "booking",
		resourceId: "BK001",
		changes: { status: { from: "pending", to: "confirmed" } },
		timestamp: "2024-01-19T14:30:00Z",
		ipAddress: "192.168.1.100",
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
	},
	{
		id: "LOG002",
		userId: "USR002",
		userName: "Sarah Johnson",
		action: "UPDATE_AVAILABILITY",
		resource: "guide",
		resourceId: "GD001",
		changes: { availability: { added: ["2024-02-15", "2024-02-16"] } },
		timestamp: "2024-01-19T13:45:00Z",
		ipAddress: "192.168.1.101",
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
	}
];

export const mockNotifications: Notification[] = [
	{
		id: "1",
		title: "New Booking",
		message: "Safari Adventure package booked by John Doe",
		type: "success",
		timestamp: "2 minutes ago",
		read: false
	},
	{
		id: "2",
		title: "Payment Failed",
		message: "Payment for booking #12345 failed",
		type: "error",
		timestamp: "15 minutes ago",
		read: false
	},
	{
		id: "3",
		title: "Guide Unavailable",
		message: "Sarah Johnson marked unavailable for next week",
		type: "warning",
		timestamp: "1 hour ago",
		read: true
	}
];
