import { ArrowLeft, Users, Phone, Mail, Download, UserCheck, Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { Separator } from '@/components/ui/separator';
import { bookingsApi } from "@/lib/api/bookings";
import { guidesApi } from "@/lib/api/guides";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseCurrency } from "@/lib/utils";
import { routes } from "@/app/routes";
import { Guide } from '@/types/guide';
import AssignGuideButton from "@/components/bookings/assign-guide-button";

interface Props { params: { id: string } };

export default async function BookingDetailPage({ params: { id } }: Props) {
  const { responses: booking } = await bookingsApi.getBooking(id);
  console.log('booking:', booking);

  let assignedGuide: Guide | null = null;
  if (booking.assigned_guide_id) {
    try {
      const guideResponse = await guidesApi.getGuide(booking.assigned_guide_id);
      console.log('guideResponse:', guideResponse);
      assignedGuide = guideResponse.responses;
    } catch (error) {
      console.error('Failed to fetch guide details:', error);
    }
  }

  if (!booking) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Booking not found</h2>
          <p className="text-muted-foreground mt-2">The booking you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href={routes.bookings.index}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Link>
          </Button>
        </div>
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bookings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {/* Back to Bookings */}
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold"> Booking <span className="uppercase"> {booking._id.substring(booking._id.length - 7, booking._id.length)} </span> </h1>
              <p className="text-muted-foreground">
                Created on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <AssignGuideButton booking_id={booking._id} />
            {booking.booking_status === 'pending' && (
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
                      {/* TODO: find correct reference for this */}
                      {/* <span className="font-medium">Package:</span> {booking.packageName} */}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Booking Date:</span> {format(booking.tour_date, 'dd MMM, yyyy')}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Participants:</span> {booking.num_guests} people
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Booking:</span>
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                      </Badge>
                    </div>
                    {/* TODO: figure out the right reference for this */}
                    {/* <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Payment:</span>
                      <Badge className={getStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </Badge>
                    </div> */}
                  </div>
                </div>
              </div>

              {assignedGuide && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Assigned Guide</h4>
                    <div className="flex items-center space-x-4">
                      {assignedGuide.photo_url && (
                        <img
                          src={assignedGuide.photo_url}
                          alt={assignedGuide.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{assignedGuide.name}</p>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{assignedGuide.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{assignedGuide.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* <Separator /> */}

              {booking.addons.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Add-ons</h4>
                    <div className="space-y-2">
                      {booking.addons.map((addOn) => (
                        <div key={addOn.name} className="flex justify-between text-sm">
                          <span>{addOn.name}</span>
                          <span> {parseCurrency(addOn.price)}</span>
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
                      {booking.guest_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.guest_email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.guest_phone}</span>
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
                    <span> {parseCurrency(booking.total_amount - booking.addons.reduce((sum, addon) => sum + (addon.price), 0))}</span>
                  </div>
                  {booking.addons.map((addOn) => (
                    <div key={addOn.name} className="flex justify-between text-sm text-muted-foreground">
                      <span>{addOn.name}:</span>
                      <span> {parseCurrency(addOn.price)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span> {parseCurrency(booking.total_amount)}</span>
                  </div>
                  {/* TODO: get right values from invoice details */}
                  {/* <div className="flex justify-between text-sm">
                    <span>Paid:</span>
                    <span className="text-green-600">GHS {booking.paidAmount.toLocaleString()}</span>
                  </div> */}
                  {/* {booking.total_amount > booking.paidAmount && (
                    <div className="flex justify-between text-sm">
                      <span>Outstanding:</span>
                      <span className="text-red-600">
                        GHS {(booking.totalAmount - booking.paidAmount).toLocaleString()}
                      </span>
                    </div>
                  )} */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}