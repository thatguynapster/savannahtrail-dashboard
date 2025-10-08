'use client'

import { MoreHorizontal, Eye, Edit, Trash2, Star, Clock, Users, Package as PackageIcon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmptyTable } from '@/components/empty-states/empty-table';
import { deleteTourPackage, updateTourPackage } from "@/lib/actions/packages";
import { Package, PackageStatus } from '@/types/package';
import { DataTable } from '@/components/ui/data-table';
import { useModal } from "@/providers/modal-provider";
import { Button } from '@/components/ui/button';
import ConfirmModal from "../ui/confirm-modal";
import { Badge } from '@/components/ui/badge';
import { parseCurrency } from "@/lib/utils";
import { routes } from "@/app/routes";
import { toast } from "sonner";

const getStatusColor = (status: PackageStatus) => {
    const colors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colors[status];
};

type Props = { packages: Package[] }

const PackagesTable = ({ packages }: Props) => {
    const router = useRouter();
    const { setOpen, setClose } = useModal();

    const handleDelete = async (id: string) => {
        try {
            await deleteTourPackage(id);
            toast.success('Package deleted successfully');
        } catch (error) {
            toast.error('Failed to delete package');
        } finally {
            setClose();
        }
    }

    const handleActivation = async (id: string) => {
        console.log('Activating package:', id);
        try {
            await updateTourPackage(JSON.stringify({ _id: id, status: 'active' }));
            toast.success('Package activated successfully');
        } catch (error) {
            toast.error('Failed to activate package');
        } finally {
            setClose();
        }
    }

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
                            {['draft', 'inactive'].includes(row.original.status) &&
                                <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() => {
                                        setOpen(
                                            <ConfirmModal
                                                cancel={{
                                                    text: "No, Cancel"
                                                }}
                                                confirm={{
                                                    variant: 'success',
                                                    text: "Yes, Activate",
                                                    action: () => handleActivation(row.original._id),
                                                }}
                                                confirmText={
                                                    <>
                                                        Are you sure you want to activate the package {row.original.title}?
                                                        <br />
                                                        {row.original.title} will now be visible on the website and available for bookings.
                                                    </>
                                                }
                                            />
                                        )
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {row.original.status === 'inactive' ? 'Reactivate' : 'Activate'} Package
                                </DropdownMenuItem>
                            }

                            {['draft', 'active'].includes(row.original.status) &&
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                        setOpen(
                                            <ConfirmModal
                                                cancel={{
                                                    text: "No, Cancel"
                                                }}
                                                confirm={{
                                                    variant: 'error',
                                                    text: "Yes, Delete",
                                                    action: () => handleDelete(row.original._id),
                                                }}
                                                confirmText={
                                                    <>
                                                        Are you sure you want to delete the package {row.original.title}?
                                                        <br />
                                                        The package will no longer be visible on the website or available for bookings.
                                                    </>
                                                }
                                            />
                                        )
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Package
                                </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

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