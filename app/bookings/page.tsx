'use client';

import {
  MoreHorizontal,
  Eye,
  UserCheck,
  X,
  Check,
  Download,
  Plus,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking, BookingStatus, PaymentStatus } from '@/types/booking';
import { MainLayout } from '@/components/layout/main-layout';
import { DataTable } from '@/components/ui/data-table';
import { bookingsApi } from '@/lib/api/bookings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { EmptyTable } from '@/components/empty-states/empty-table';
import { mockBookings } from "@/data/dummy";

const getStatusColor = (status: BookingStatus) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  };
  return colors[status];
};

const getPaymentStatusColor = (status: PaymentStatus) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  };
  return colors[status];
};

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'id',
    header: 'Booking ID',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.getValue('customer') as Booking['customer'];
      return (
        <div>
          <div className="font-medium">{customer.firstName} {customer.lastName}</div>
          <div className="text-sm text-muted-foreground">{customer.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'packageName',
    header: 'Package',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('startDate')), 'MMM dd, yyyy');
    },
  },
  {
    accessorKey: 'participants',
    header: 'Participants',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      return <div className="font-medium">GHS {amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as BookingStatus;
      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
      const status = row.getValue('paymentStatus') as PaymentStatus;
      return (
        <Badge className={getPaymentStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/bookings/${booking.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserCheck className="mr-2 h-4 w-4" />
              Reassign Guide
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {booking.status === 'pending' && (
              <DropdownMenuItem>
                <Check className="mr-2 h-4 w-4" />
                Confirm Booking
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600">
              <X className="mr-2 h-4 w-4" />
              Cancel Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: () => bookingsApi.getBookings(page, limit),
    initialData: {
      bookings: mockBookings,
      total: mockBookings.length,
      page: 1,
      limit: 10,
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Bookings</h1>
              <p className="text-muted-foreground">
                Manage tour bookings and customer reservations
              </p>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>
          <TableSkeleton 
            title="All Bookings" 
            description="Loading bookings data..."
            rows={8}
            columns={8}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-muted-foreground">
              Manage tour bookings and customer reservations
            </p>
          </div>
          <Button asChild>
            <Link href="/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              A list of all tour bookings with their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsData.bookings.length === 0 ? (
              <EmptyTable
                title="No bookings found"
                description="You haven't received any bookings yet. Once customers start booking your tours, they'll appear here."
                icon={Calendar}
                actionLabel="Create Package"
                onAction={() => window.location.href = '/packages/new'}
              />
            ) : (
              <DataTable
                columns={columns}
                data={bookingsData.bookings}
                searchKey="customer"
                searchPlaceholder="Search customers..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}