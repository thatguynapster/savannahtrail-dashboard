export interface DashboardKPIs {
  totalRevenue: {
    value: number;
    change: number;
    period: string;
  };
  totalBookings: {
    value: number;
    change: number;
    period: string;
  };
  activeGuides: {
    value: number;
    change: number;
    period: string;
  };
  averageRating: {
    value: number;
    change: number;
    period: string;
  };
  conversionRate: {
    value: number;
    change: number;
    period: string;
  };
  pendingPayments: {
    value: number;
    change: number;
    period: string;
  };
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface PopularPackage {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'payment' | 'guide' | 'package';
  description: string;
  timestamp: string;
  user: string;
}