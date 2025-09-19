'use client';

import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Smartphone,
  Building,
  AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentEvent, PaymentEventType, PaymentMethod } from '@/types/payment';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { EmptyTable } from '@/components/empty-states/empty-table';
import { mockPaymentEvents } from "@/data/dummy";

const getEventTypeColor = (type: PaymentEventType) => {
  const colors = {
    payment_initiated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    payment_success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    payment_failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    refund_processed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  };
  return colors[type];
};

const getEventIcon = (type: PaymentEventType) => {
  const icons = {
    payment_initiated: <Clock className="h-4 w-4" />,
    payment_success: <CheckCircle className="h-4 w-4" />,
    payment_failed: <XCircle className="h-4 w-4" />,
    refund_processed: <RefreshCw className="h-4 w-4" />,
  };
  return icons[type];
};

const getMethodIcon = (method: PaymentMethod) => {
  const icons = {
    card: <CreditCard className="h-4 w-4" />,
    mobile_money: <Smartphone className="h-4 w-4" />,
    bank_transfer: <Building className="h-4 w-4" />,
  };
  return icons[method];
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 20;

  // const { data: paymentsData, isLoading, refetch } = useQuery({
  //   queryKey: ['payment-events', page, limit],
  //   queryFn: () => paymentsApi.getPaymentEvents(page, limit),
  //   initialData: {
  //     events: mockPaymentEvents,
  //     total: mockPaymentEvents.length,
  //     page: 1,
  //     limit: 20,
  //   },
  //   refetchInterval: 30000, // Refresh every 30 seconds
  // });
  const paymentsData = { events: [...mockPaymentEvents] }

  const handleRetryPayment = async (paymentId: string) => {
    try {
      // await paymentsApi.retryPayment({ paymentId });
      // refetch();
    } catch (error) {
      console.error('Failed to retry payment:', error);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      // await paymentsApi.verifyPayment(paymentId);
      // refetch();
    } catch (error) {
      console.error('Failed to verify payment:', error);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Payment Events</h1>
              <p className="text-muted-foreground">
                Monitor payment transactions and handle failed payments
              </p>
            </div>
            <Button disabled>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Payment Stats Skeleton */}
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-300 rounded" />
                    <span className="text-sm font-medium">Loading...</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">--</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payment Events</CardTitle>
              <CardDescription>
                Loading payment transaction data...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gray-300 rounded" />
                        <div className="h-4 w-4 bg-gray-300 rounded" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-4 w-48 bg-gray-300 rounded" />
                        <div className="h-3 w-64 bg-gray-200 rounded" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="h-4 w-20 bg-gray-300 rounded mb-1" />
                        <div className="h-3 w-16 bg-gray-200 rounded" />
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Events</h1>
            <p className="text-muted-foreground">
              Monitor payment transactions and handle failed payments
            </p>
          </div>
          {/* <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button> */}
        </div>

        {/* Payment Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Successful</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {paymentsData.events.filter(e => e.type === 'payment_success').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Failed</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {paymentsData.events.filter(e => e.type === 'payment_failed').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {paymentsData.events.filter(e => e.type === 'payment_initiated').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Refunds</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {paymentsData.events.filter(e => e.type === 'refund_processed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payment Events</CardTitle>
            <CardDescription>
              Real-time payment transaction monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paymentsData.events.length === 0 ? (
              <EmptyTable
                title="No payment events found"
                description="Payment transactions will appear here once customers start making bookings and payments."
                icon={CreditCard}
                showAction={false}
              />
            ) : (
              <div className="space-y-4">
                {paymentsData.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getEventIcon(event.type)}
                        {getMethodIcon(event.method)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{event.customerName}</span>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Booking: {event.bookingId} • {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reference: {event.reference}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">GHS {event.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {event.method.replace('_', ' ')}
                        </div>
                      </div>

                      {event.type === 'payment_failed' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetryPayment(event.id)}
                          >
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Retry
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyPayment(event.id)}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verify
                          </Button>
                        </div>
                      )}

                      {event.type === 'payment_initiated' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyPayment(event.id)}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}