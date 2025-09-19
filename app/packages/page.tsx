'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { MainLayout } from '@/components/layout/main-layout';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { packagesApi } from '@/lib/api/packages';
import { Package, PackageStatus, DifficultyLevel } from '@/types/package';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  Clock,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { EmptyTable } from '@/components/empty-states/empty-table';
import { mockPackages } from "@/data/dummy";

const getStatusColor = (status: PackageStatus) => {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  };
  return colors[status];
};

const getDifficultyColor = (difficulty: DifficultyLevel) => {
  const colors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    challenging: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    extreme: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  };
  return colors[difficulty];
};

const columns: ColumnDef<Package>[] = [
  {
    accessorKey: 'name',
    header: 'Package Name',
    cell: ({ row }) => {
      const pkg = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{pkg.name}</span>
            {pkg.isPopular && <Star className="h-4 w-4 text-yellow-500" />}
          </div>
          <p className="text-sm text-muted-foreground">{pkg.shortDescription}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return <div className="font-medium">GHS {price.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.getValue('duration') as number;
      return (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{duration} days</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'maxParticipants',
    header: 'Capacity',
    cell: ({ row }) => {
      const max = row.getValue('maxParticipants') as number;
      const min = row.original.minParticipants;
      return (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{min}-{max}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ row }) => {
      const difficulty = row.getValue('difficulty') as DifficultyLevel;
      return (
        <Badge className={getDifficultyColor(difficulty)}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as PackageStatus;
      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const pkg = row.original;

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
              <Link href={`/packages/${pkg.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/packages/${pkg.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Package
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Package
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const packagesData = mockPackages;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Packages</h1>
              <p className="text-muted-foreground">
                Manage tour packages and their availability
              </p>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              New Package
            </Button>
          </div>
          <TableSkeleton 
            title="All Packages" 
            description="Loading packages data..."
            rows={6}
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
            <h1 className="text-3xl font-bold">Packages</h1>
            <p className="text-muted-foreground">
              Manage tour packages and their availability
            </p>
          </div>
          <Button asChild>
            <Link href="/packages/new">
              <Plus className="mr-2 h-4 w-4" />
              New Package
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Packages</CardTitle>
            <CardDescription>
              A list of all tour packages with their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {packagesData.length === 0 ? (
              <EmptyTable
                title="No packages found"
                description="Create your first tour package to start accepting bookings from customers."
                icon={Package}
                actionLabel="Create Package"
                onAction={() => window.location.href = '/packages/new'}
              />
            ) : (
              <DataTable
                columns={columns}
                data={packagesData}
                searchKey="name"
                searchPlaceholder="Search packages..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}