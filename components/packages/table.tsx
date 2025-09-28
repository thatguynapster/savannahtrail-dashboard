'use client'

import { MoreHorizontal, Eye, Edit, Trash2, Star, Clock, Users, Package as PackageIcon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmptyTable } from '@/components/empty-states/empty-table';
import { Package, PackageStatus } from '@/types/package';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseCurrency } from "@/lib/utils";


const getStatusColor = (status: PackageStatus) => {
    const colors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colors[status];
};

const columns: ColumnDef<Package>[] = [
    {
        accessorKey: 'title',
        header: 'Package Name',
        cell: ({ row }) => {
            return (
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">{row.original.title}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'base_price',
        header: 'Price',
        cell: ({ row }) => {
            return <div className="font-medium">{parseCurrency(parseFloat(row.getValue('base_price')))}</div>;
        },
    },
    {
        accessorKey: 'duration_hours',
        header: 'Duration',
        cell: ({ row }) => {
            return (
                <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{row.getValue('duration_hours') as number} days</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'guest_limit',
        header: 'Capacity',
        cell: ({ row }) => {
            return (
                <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{row.getValue('guest_limit')}</span>
                </div>
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
                            <Link href={`/packages/${row.original._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/packages/${row.original._id}/edit`}>
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

type Props = { packages: Package[] }

const PackagesTable = ({ packages }: Props) => {

    return (
        <>
            {packages.length === 0 ? (
                <EmptyTable
                    title="No packages found"
                    description="Create your first tour package to start accepting bookings from customers."
                    icon={PackageIcon}
                    actionLabel="Create Package"
                    onAction={() => window.location.href = '/packages/new'}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={packages}
                    searchKey="title"
                    searchPlaceholder="Search packages..."
                />
            )}
        </>
    )
}

export default PackagesTable