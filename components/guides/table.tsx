'use client'

import { MoreHorizontal, Eye, Edit, Trash2, Star, Clock, Users, Package as PackageIcon, Calendar } from 'lucide-react';
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
import { Guide, GuideStatus } from "@/types/guide";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const getStatusColor = (status: GuideStatus) => {
    const colors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        on_leave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    };
    return colors[status];
};

type Props = { guides: Guide[] }

const GuidesTable = ({ guides }: Props) => {
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

    const columns: ColumnDef<Guide>[] = [
        {
            accessorKey: 'name',
            header: 'Guide',
            cell: ({ row }) => {
                const guide = row.original;
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={guide.photo_url} alt={guide.name} />
                            <AvatarFallback>
                                {guide.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{guide.name}</div>
                            <div className="text-sm text-muted-foreground">{guide.email}</div>
                            <div className="text-sm text-muted-foreground">{guide.phone}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'languages',
            header: 'Languages',
            cell: ({ row }) => {
                const languages = row.getValue('languages') as string[];
                return (
                    <div className="flex flex-wrap gap-1">
                        {languages.length == 0 && 'N/A'}
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
                        {specialties.length == 0 && 'N/A'}
                        {specialties.length > 2 && (
                            <span className="text-xs text-muted-foreground"> +{specialties.length - 2} more</span>
                        )}
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
                                <Link href={`/guides/${guide._id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/guides/${guide._id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Guide
                                </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem asChild>
                                <Link href={`/guides/${guide._id}/availability`}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Manage Availability
                                </Link>
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            {guide.status === 'active' &&
                                <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deactivate Guide
                                </DropdownMenuItem>
                            }
                            {guide.status === 'inactive' &&
                                <DropdownMenuItem className="text-green-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Activate Guide
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
            {guides.length === 0 ? (
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
                    data={guides}
                    searchKey="name"
                    searchPlaceholder="Search guides..."
                />
            )}
        </>
    )
}

export default GuidesTable