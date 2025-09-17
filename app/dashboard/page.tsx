'use client';

import { KPICard } from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/main-layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  DollarSign,
  Calendar,
  Users,
  Star,
  TrendingUp,
  AlertCircle,
  Plus,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for development
const mockKPIs = {
  totalRevenue: { value: 125000, change: 12.5, period: 'last month' },
  totalBookings: { value: 89, change: 8.2, period: 'last month' },
  activeGuides: { value: 12, change: 0, period: 'last month' },
  averageRating: { value: 4.8, change: 2.1, period: 'last month' },
  conversionRate: { value: 24.5, change: -1.2, period: 'last month' },
  pendingPayments: { value: 15000, change: -5.3, period: 'last month' },
};

const mockRevenueData = [
  { date: '2024-01-01', revenue: 12000, bookings: 8 },
  { date: '2024-01-02', revenue: 15000, bookings: 12 },
  { date: '2024-01-03', revenue: 18000, bookings: 15 },
  { date: '2024-01-04', revenue: 22000, bookings: 18 },
  { date: '2024-01-05', revenue: 25000, bookings: 20 },
  { date: '2024-01-06', revenue: 28000, bookings: 22 },
  { date: '2024-01-07', revenue: 32000, bookings: 25 },
];

const mockPopularPackages = [
  { id: '1', name: 'Safari Adventure', bookings: 25, revenue: 45000 },
  { id: '2', name: 'Cultural Heritage Tour', bookings: 18, revenue: 32000 },
  { id: '3', name: 'Wildlife Photography', bookings: 15, revenue: 28000 },
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'booking' as const,
    description: 'New booking for Safari Adventure',
    timestamp: '2 minutes ago',
    user: 'John Doe',
  },
  {
    id: '2',
    type: 'payment' as const,
    description: 'Payment received for booking #12345',
    timestamp: '15 minutes ago',
    user: 'System',
  },
  {
    id: '3',
    type: 'guide' as const,
    description: 'Sarah Johnson updated availability',
    timestamp: '1 hour ago',
    user: 'Sarah Johnson',
  },
];

export default function DashboardPage() {

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex space-x-2">
            <Button asChild>
              <Link href="/bookings/new">
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title="Total Revenue"
            value={`GHS ${mockKPIs.totalRevenue.value.toLocaleString()}`}
            change={mockKPIs.totalRevenue.change}
            period={mockKPIs.totalRevenue.period}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <KPICard
            title="Total Bookings"
            value={mockKPIs.totalBookings.value}
            change={mockKPIs.totalBookings.change}
            period={mockKPIs.totalBookings.period}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
          <KPICard
            title="Active Guides"
            value={mockKPIs.activeGuides.value}
            change={mockKPIs.activeGuides.change}
            period={mockKPIs.activeGuides.period}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <KPICard
            title="Average Rating"
            value={mockKPIs.averageRating.value.toFixed(1)}
            change={mockKPIs.averageRating.change}
            period={mockKPIs.averageRating.period}
            icon={<Star className="h-4 w-4 text-muted-foreground" />}
          />
          <KPICard
            title="Conversion Rate"
            value={`${mockKPIs.conversionRate.value}%`}
            change={mockKPIs.conversionRate.change}
            period={mockKPIs.conversionRate.period}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <KPICard
            title="Pending Payments"
            value={`GHS ${mockKPIs.pendingPayments.value.toLocaleString()}`}
            change={mockKPIs.pendingPayments.change}
            period={mockKPIs.pendingPayments.period}
            icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Revenue Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Revenue & Bookings Trend</CardTitle>
              <CardDescription>
                Revenue and booking trends over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis yAxisId="revenue" orientation="left" />
                  <YAxis yAxisId="bookings" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [
                      name === 'revenue' ? `GHS ${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Line
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: '#f97316' }}
                  />
                  <Line
                    yAxisId="bookings"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Popular Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Packages</CardTitle>
              <CardDescription>
                Top performing packages this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockPopularPackages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? `GHS ${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Bar dataKey="bookings" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/alerts">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        by {activity.user} • {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}