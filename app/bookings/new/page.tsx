'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import {
    ArrowLeft,
    Calendar,
    Users,
    Package,
    CreditCard,
    Plus,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { MainLayout } from '@/components/layout/main-layout';
import { mockPackages, mockGuides } from '@/data/dummy';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const bookingSchema = z.object({
    packageId: z.string().min(1, 'Package is required'),
    guideId: z.string().optional(),
    customer: z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        phone: z.string().min(1, 'Phone number is required'),
        nationality: z.string().min(1, 'Nationality is required'),
    }),
    startDate: z.date(),
    endDate: z.date(),
    participants: z.number().min(1, 'At least 1 participant is required'),
    specialRequests: z.string().optional(),
    addOns: z.array(z.object({
        id: z.string(),
        quantity: z.number().min(1),
    })).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function NewBookingPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [addOns, setAddOns] = useState<Array<{ id: string; quantity: number }>>([]);

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            customer: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                nationality: '',
            },
            participants: 1,
            specialRequests: '',
            addOns: [],
        },
    });

    const onSubmit = async (data: BookingFormData) => {
        try {
            setIsSubmitting(true);
            // API call would go here
            console.log('Booking data:', data);
            toast.success('Booking created successfully');
            router.push('/bookings');
        } catch (error) {
            toast.error('Failed to create booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePackageChange = (packageId: string) => {
        const pkg = mockPackages.find(p => p.id === packageId);
        setSelectedPackage(pkg);
        form.setValue('packageId', packageId);

        if (pkg) {
            // Set end date based on package duration
            const startDate = form.getValues('startDate');
            if (startDate) {
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + pkg.duration - 1);
                form.setValue('endDate', endDate);
            }
        }
    };

    const handleStartDateChange = (date: Date | undefined) => {
        if (date) {
            form.setValue('startDate', date);

            // Update end date if package is selected
            if (selectedPackage) {
                const endDate = new Date(date);
                endDate.setDate(endDate.getDate() + selectedPackage.duration - 1);
                form.setValue('endDate', endDate);
            }
        }
    };

    const addAddOn = (addOnId: string) => {
        const existing = addOns.find(a => a.id === addOnId);
        if (existing) {
            setAddOns(addOns.map(a =>
                a.id === addOnId ? { ...a, quantity: a.quantity + 1 } : a
            ));
        } else {
            setAddOns([...addOns, { id: addOnId, quantity: 1 }]);
        }
        form.setValue('addOns', addOns);
    };

    const removeAddOn = (addOnId: string) => {
        const updated = addOns.filter(a => a.id !== addOnId);
        setAddOns(updated);
        form.setValue('addOns', updated);
    };

    const calculateTotal = () => {
        if (!selectedPackage) return 0;

        let total = selectedPackage.price * form.watch('participants');

        addOns.forEach(addOn => {
            const packageAddOn = selectedPackage.addOns.find((a: any) => a.id === addOn.id);
            if (packageAddOn) {
                total += packageAddOn.price * addOn.quantity;
            }
        });

        return total;
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/bookings">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Bookings
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

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Form */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Package Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Package className="h-5 w-5" />
                                        <span>Package Selection</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="packageId">Tour Package *</Label>
                                        <Select onValueChange={handlePackageChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a package" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockPackages.map((pkg) => (
                                                    <SelectItem key={pkg.id} value={pkg.id}>
                                                        <div className="flex flex-col">
                                                            <span>{pkg.name}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {pkg.duration} days • GHS {pkg.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.formState.errors.packageId && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.packageId.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guideId">Tour Guide (Optional)</Label>
                                        <Select onValueChange={(value) => form.setValue('guideId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a guide" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockGuides.filter(g => g.status === 'active').map((guide) => (
                                                    <SelectItem key={guide.id} value={guide.id}>
                                                        <div className="flex flex-col">
                                                            <span>{guide.firstName} {guide.lastName}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {guide.specialties.slice(0, 2).join(', ')}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Users className="h-5 w-5" />
                                        <span>Customer Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                {...form.register('customer.firstName')}
                                            />
                                            {form.formState.errors.customer?.firstName && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.customer.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                {...form.register('customer.lastName')}
                                            />
                                            {form.formState.errors.customer?.lastName && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.customer.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...form.register('customer.email')}
                                            />
                                            {form.formState.errors.customer?.email && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.customer.email.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                {...form.register('customer.phone')}
                                            />
                                            {form.formState.errors.customer?.phone && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.customer.phone.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nationality">Nationality *</Label>
                                        <Input
                                            id="nationality"
                                            {...form.register('customer.nationality')}
                                        />
                                        {form.formState.errors.customer?.nationality && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.customer.nationality.message}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Booking Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5" />
                                        <span>Booking Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label>Start Date *</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !form.watch('startDate') && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        {form.watch('startDate') ? (
                                                            format(form.watch('startDate'), 'PPP')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={form.watch('startDate')}
                                                        onSelect={handleStartDateChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {form.formState.errors.startDate && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.startDate.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>End Date *</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !form.watch('endDate') && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        {form.watch('endDate') ? (
                                                            format(form.watch('endDate'), 'PPP')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={form.watch('endDate')}
                                                        onSelect={(date) => date && form.setValue('endDate', date)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {form.formState.errors.endDate && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.endDate.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="participants">Participants *</Label>
                                            <Input
                                                id="participants"
                                                type="number"
                                                min="1"
                                                {...form.register('participants', { valueAsNumber: true })}
                                            />
                                            {form.formState.errors.participants && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.participants.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="specialRequests">Special Requests</Label>
                                        <Textarea
                                            id="specialRequests"
                                            placeholder="Any special requirements or requests..."
                                            {...form.register('specialRequests')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Add-ons */}
                            {selectedPackage && selectedPackage.addOns.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Add-ons</CardTitle>
                                        <CardDescription>
                                            Optional extras for this package
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {selectedPackage.addOns.map((addOn: any) => {
                                            const selectedAddOn = addOns.find(a => a.id === addOn.id);
                                            return (
                                                <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{addOn.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{addOn.description}</p>
                                                        <p className="text-sm font-medium">GHS {addOn.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {selectedAddOn ? (
                                                            <>
                                                                <span className="text-sm">Qty: {selectedAddOn.quantity}</span>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => removeAddOn(addOn.id)}
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                onClick={() => addAddOn(addOn.id)}
                                                            >
                                                                <Plus className="mr-1 h-3 w-3" />
                                                                Add
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <CreditCard className="h-5 w-5" />
                                        <span>Booking Summary</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {selectedPackage ? (
                                        <>
                                            <div className="space-y-2">
                                                <h4 className="font-medium">{selectedPackage.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedPackage.duration} days • {form.watch('participants')} participants
                                                </p>
                                            </div>

                                            <Separator />

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Package price:</span>
                                                    <span>GHS {selectedPackage.price.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Participants:</span>
                                                    <span>× {form.watch('participants')}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Subtotal:</span>
                                                    <span>GHS {(selectedPackage.price * form.watch('participants')).toLocaleString()}</span>
                                                </div>

                                                {addOns.map(addOn => {
                                                    const packageAddOn = selectedPackage.addOns.find((a: any) => a.id === addOn.id);
                                                    if (!packageAddOn) return null;
                                                    return (
                                                        <div key={addOn.id} className="flex justify-between text-sm text-muted-foreground">
                                                            <span>{packageAddOn.name} (×{addOn.quantity}):</span>
                                                            <span>GHS {(packageAddOn.price * addOn.quantity).toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })}

                                                <Separator />

                                                <div className="flex justify-between font-medium">
                                                    <span>Total:</span>
                                                    <span>GHS {calculateTotal().toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Select a package to see pricing details
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Booking'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}