'use client';

import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MainLayout } from '@/components/layout/main-layout';
import { DataTable } from '@/components/ui/data-table';
import { Guide, GuideStatus } from '@/types/guide';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { EmptyTable } from '@/components/empty-states/empty-table';
import { mockGuides } from "@/data/dummy";

const getStatusColor = (status: GuideStatus) => {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    on_leave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  };
  return colors[status];
};

const columns: ColumnDef<Guide>[] = [
  {
    accessorKey: 'name',
    header: 'Guide',
    cell: ({ row }) => {
      const guide = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={guide.avatar} alt={`${guide.firstName} ${guide.lastName}`} />
            <AvatarFallback>
              {guide.firstName[0]}{guide.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{guide.firstName} {guide.lastName}</div>
            <div className="text-sm text-muted-foreground">{guide.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'experience',
    header: 'Experience',
    cell: ({ row }) => {
      const experience = row.getValue('experience') as number;
      return <span>{experience} years</span>;
    },
  },
  {
    accessorKey: 'languages',
    header: 'Languages',
    cell: ({ row }) => {
      const languages = row.getValue('languages') as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {languages.slice(0, 2).map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs">
              {lang}
            </Badge>
          ))}
          {languages.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{languages.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'specialties',
    header: 'Specialties',
    cell: ({ row }) => {
      const specialties = row.getValue('specialties') as string[];
      return (
        <div className="max-w-48">
          <span className="text-sm">{specialties.slice(0, 2).join(', ')}</span>
          {specialties.length > 2 && (
            <span className="text-xs text-muted-foreground"> +{specialties.length - 2} more</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number;
      const totalTours = row.original.totalTours;
      return (
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({totalTours})</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as GuideStatus;
      return (
        <Badge className={getStatusColor(status)}>
          {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const guide = row.original;

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
              <Link href={`/guides/${guide.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/guides/${guide.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Guide
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/guides/${guide.id}/availability`}>
                <Calendar className="mr-2 h-4 w-4" />
                Manage Availability
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Deactivate Guide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function GuidesPage() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  // const { data: guidesData, isLoading } = useQuery({
  //   queryKey: ['guides', page, limit],
  //   queryFn: () => guidesApi.getGuides(page, limit),
  //   initialData: {
  //     guides: mockGuides,
  //     total: mockGuides.length,
  //     page: 1,
  //     limit: 10,
  //   },
  // });
  const guidesData = mockGuides;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tour Guides</h1>
              <p className="text-muted-foreground">
                Manage tour guides and their availability
              </p>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add Guide
            </Button>
          </div>

          {/* Quick Stats Skeleton */}
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    <span className="text-sm font-medium">Loading...</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">--</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <TableSkeleton 
            title="All Guides" 
            description="Loading guides data..."
            rows={5}
            columns={6}
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
            <h1 className="text-3xl font-bold">Tour Guides</h1>
            <p className="text-muted-foreground">
              Manage tour guides and their availability
            </p>
          </div>
          <Button asChild>
            <Link href="/guides/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Guide
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Active Guides</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {guidesData.filter(g => g.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">On Leave</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {guidesData.filter(g => g.status === 'on_leave').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {(guidesData.reduce((sum, g) => sum + g.rating, 0) / guidesData.length).toFixed(1)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Tours</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {guidesData.reduce((sum, g) => sum + g.totalTours, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Guides</CardTitle>
            <CardDescription>
              Manage tour guides, their profiles, and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {guidesData.length === 0 ? (
              <EmptyTable
                title="No guides found"
                description="Add experienced tour guides to lead your tours and provide exceptional customer experiences."
                icon={Users}
                actionLabel="Add Guide"
                onAction={() => window.location.href = '/guides/new'}
              />
            ) : (
              <DataTable
                columns={columns}
                data={guidesData}
                searchKey="firstName"
                searchPlaceholder="Search guides..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}