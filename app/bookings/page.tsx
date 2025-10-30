import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import BookingsTable from "@/components/bookings/table";
import { bookingsApi } from "@/lib/api/bookings";
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BookingsPage({ searchParams }: Props) {
  const page = searchParams['page'] ?? '0'
  const limit = 10;

  const { responses: { docs: bookings, total, pages } } = await bookingsApi.getBookings(+page, limit);
  console.log('response:', bookings);

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
            <BookingsTable {...{ bookings }} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}