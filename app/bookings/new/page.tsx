import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import CreateBooking from "@/components/bookings/create-booking";
import { MainLayout } from '@/components/layout/main-layout';
import { packagesApi } from "@/lib/api/packages";
import { Button } from '@/components/ui/button';
import { guidesApi } from "@/lib/api/guides";

export default async function NewBookingPage() {
    // get packages for selection
    const { responses: { docs: packages } } = await packagesApi.getPackages();

    // get guides for selection
    const { responses: { docs: guides } } = await guidesApi.getGuides(1);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/bookings">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {/* Back to Bookings */}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Booking</h1>
                            <p className="text-muted-foreground">
                                Add a new booking for a customer
                            </p>
                        </div>
                    </div>
                </div>

                <CreateBooking {...{ guides, packages }} />
            </div>
        </MainLayout>
    );
}