'use client'

import { MoreHorizontal, Eye, Users, UserCheck, Download, Check, X } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from "next/navigation";
import Link from 'next/link';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Booking, BookingStatus, PaymentStatus } from "@/types/booking";
import { EmptyTable } from '@/components/empty-states/empty-table';
import { DataTable } from '@/components/ui/data-table';
import { useModal } from "@/providers/modal-provider";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from "date-fns";
import { parseCurrency } from "@/lib/utils";
import AssignGuideModal from "./assign-guide";
import ConfirmModal from "../ui/confirm-modal";

const getStatusColor = (status: BookingStatus) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colors[status];
};

const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colors[status];
};

type Props = { bookings: Booking[] }

const BookingsTable = ({ bookings }: Props) => {
    const router = useRouter();
    const { setOpen } = useModal();

    const columns: ColumnDef<Booking>[] = [
        {
            accessorKey: '_id',
            header: 'Booking ID',
            cell: ({ row }) => {
                const id = row.getValue('_id') as string;
                return <div className="font-medium uppercase">{id.substring(id.length - 7, id.length)}</div>

            }
        },
        {
            accessorKey: 'customer',
            header: 'Customer',
            cell: ({ row }) => {
                return (
                    <div>
                        <div className="font-medium">{row.original.guest_name}</div>
                        <div className="text-sm text-muted-foreground">{row.original.guest_email}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'package',
            header: 'Package',
        },
        {
            accessorKey: 'tour_date',
            header: 'Tour Date',
            cell: ({ row }) => {
                return <div className="whitespace-nowrap">
                    {format(new Date(row.getValue('tour_date')), 'do MMM, yyyy')}
                </div>
            },
        },
        {
            accessorKey: 'num_guests',
            header: 'Participants',
        },
        {
            accessorKey: 'total_amount',
            header: 'Amount',
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('total_amount'));
                return <div className="font-medium">{parseCurrency(amount)}</div>;
            },
        },
        {
            accessorKey: 'booking_status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('booking_status') as BookingStatus;
                return (
                    <Badge className={getStatusColor(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'payment_status',
            header: 'Payment',
            cell: ({ row }) => {
                const status = row.getValue('payment_status') as PaymentStatus;
                return (
                    <Badge className={getPaymentStatusColor(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const booking = row.original;

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
                                <Link href={`/bookings/${booking._id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpen(
                                        <AssignGuideModal booking_id={booking._id} />
                                    )
                                }}
                            >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Reassign Guide
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {booking.booking_status === 'pending' && (
                                <DropdownMenuItem>
                                    <Check className="mr-2 h-4 w-4" />
                                    Confirm Booking
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600"
                                onClick={() => {
                                    setOpen(
                                        <ConfirmModal
                                            cancel={{
                                                text: "No, I changed my mind",
                                            }}
                                            confirm={{
                                                variant: 'error',
                                                text: "Yes, Cancel Booking",
                                                action: () => { },
                                            }}
                                            confirmText={
                                                <>
                                                    Are you sure you want to cancel the booking
                                                    {booking._id.substring(booking._id.length - 7, booking._id.length)}?
                                                </>
                                            }
                                        />
                                    )
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel Booking
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            {bookings.length === 0 ? (
                <EmptyTable
                    title="No bookings found"
                    description=""
                    icon={Users}
                // actionLabel="Add Guide"
                // onAction={() => window.location.href = '/guides/new'}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={bookings}
                    searchKey="customer"
                    searchPlaceholder="Search customers..."
                />
            )}
        </>
    )
}

export default BookingsTable