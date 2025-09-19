'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// import { bookingsApi } from '@/lib/api/bookings';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Download,
  UserCheck,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Booking } from "@/types/booking";
import { DetailSkeleton } from '@/components/loading/detail-skeleton';
import { mockBookings } from "@/data/dummy";


export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);

  const mockBooking = mockBookings.find(b => b.id === bookingId) as Booking;

  // const { data: booking, isLoading } = useQuery({
  //   queryKey: ['booking', bookingId],
  //   queryFn: () => bookingsApi.getBooking(bookingId),
  //   initialData: mockBooking,
  // });
  const booking = mockBooking;

  if (isLoading) {
    return (
      <MainLayout>
        <DetailSkeleton />
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bookings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bookings
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Booking {booking.id}</h1>
              <p className="text-muted-foreground">
                Created on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline">
              <UserCheck className="mr-2 h-4 w-4" />
              Reassign Guide
            </Button>
            {booking.status === 'pending' && (
              <Button>
                <Check className="mr-2 h-4 w-4" />
                Confirm Booking
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Booking Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Package Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Package:</span> {booking.packageName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Duration:</span> {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Participants:</span> {booking.participants} people
                    </p>
                    {booking.guideName && (
                      <p className="text-sm">
                        <span className="font-medium">Guide:</span> {booking.guideName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Booking:</span>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Payment:</span>
                      <Badge className={getStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Special Requests</h4>
                <p className="text-sm text-muted-foreground">
                  {booking.specialRequests || 'No special requests'}
                </p>
              </div>

              {booking.addOns.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Add-ons</h4>
                    <div className="space-y-2">
                      {booking.addOns.map((addOn) => (
                        <div key={addOn.id} className="flex justify-between text-sm">
                          <span>{addOn.name} (x{addOn.quantity})</span>
                          <span>GHS {(addOn.price * addOn.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.customer.nationality}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>GHS {(booking.totalAmount - booking.addOns.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0)).toLocaleString()}</span>
                  </div>
                  {booking.addOns.map((addOn) => (
                    <div key={addOn.id} className="flex justify-between text-sm text-muted-foreground">
                      <span>{addOn.name}:</span>
                      <span>GHS {(addOn.price * addOn.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>GHS {booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Paid:</span>
                    <span className="text-green-600">GHS {booking.paidAmount.toLocaleString()}</span>
                  </div>
                  {booking.totalAmount > booking.paidAmount && (
                    <div className="flex justify-between text-sm">
                      <span>Outstanding:</span>
                      <span className="text-red-600">
                        GHS {(booking.totalAmount - booking.paidAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}