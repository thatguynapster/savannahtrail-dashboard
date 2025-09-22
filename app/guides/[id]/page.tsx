'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AvailabilityCalendar } from '@/components/ui/availability-calendar';
// import { guidesApi } from '@/lib/api/guides';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Award,
  Edit,
  UserCheck,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Guide } from "@/types/guide";
import { DetailSkeleton } from '@/components/loading/detail-skeleton';
import { mockGuides } from "@/data/dummy";
import { useState } from "react";

export default function GuideDetailPage() {
  const params = useParams();
  const guideId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const guide = mockGuides.find(g => g.id === guideId) as Guide;

  // const { data: guide, isLoading } = useQuery({
  //   queryKey: ['guide', guideId],
  //   queryFn: () => guidesApi.getGuide(guideId),
  // });

  // const { data: availability } = useQuery({
  //   queryKey: ['guide-availability', guideId],
  //   queryFn: () => guidesApi.getAvailability(guideId, '2024-02'),
  //   enabled: !!guide,
  // });

  if (isLoading) {
    return (
      <MainLayout>
        <DetailSkeleton />
      </MainLayout>
    );
  }

  if (!guide) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Guide not found</h2>
          <p className="text-muted-foreground mt-2">The guide you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/guides">Back to Guides</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      on_leave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const availabilityData = guide.availability.map(a => ({
    date: new Date(a.date),
    isAvailable: a.isAvailable,
    bookingId: a.bookingId,
    packageName: a.packageName,
  })) || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/guides">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Guides
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{guide.firstName} {guide.lastName}</h1>
              <p className="text-muted-foreground">
                Joined {format(new Date(guide.joinedAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/guides/${guide.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline">
              <UserCheck className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Guide Profile */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={guide.avatar} alt={`${guide.firstName} ${guide.lastName}`} />
                <AvatarFallback className="text-2xl">
                  {guide.firstName[0]}{guide.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{guide.firstName} {guide.lastName}</CardTitle>
              <CardDescription>{guide.specialties.join(' • ')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Badge className={getStatusColor(guide.status)}>
                  {guide.status.replace('_', ' ').charAt(0).toUpperCase() + guide.status.replace('_', ' ').slice(1)}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{guide.rating}</span>
                  <span className="text-sm text-muted-foreground">({guide.totalTours} tours)</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{guide.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{guide.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{guide.experience} years experience</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Languages</h4>
                <div className="flex flex-wrap gap-1">
                  {guide.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Certifications</h4>
                <div className="space-y-1">
                  {guide.certifications.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Award className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guide Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{guide.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {guide.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium">Name:</span>
                    <span className="ml-2 text-sm">{guide.emergencyContact.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Relationship:</span>
                    <span className="ml-2 text-sm">{guide.emergencyContact.relationship}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="ml-2 text-sm">{guide.emergencyContact.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Availability Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>
              View and manage guide availability for bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailabilityCalendar
              availabilityData={availabilityData}
              onDateSelect={(date, isAvailable) => {
                console.log('Date selected:', date, 'Available:', isAvailable);
              }}
              onSave={(dates) => {
                console.log('Saving availability:', dates);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}