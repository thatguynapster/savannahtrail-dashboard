'use client';

import { Calendar, Users, Package, CreditCard, Trash2, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { PackageAddOn, Package as TourPackage } from "@/types/package";
import { Separator } from '@/components/ui/separator';
import { cn, parseCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PhoneInput } from "../ui/phone-input";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Guide } from "@/types/guide";
import { routes } from "@/app/routes";
import { createBooking } from "@/lib/actions/bookings";

const bookingSchema = z.object({
    package_id: z.string().min(1, 'Package is required'),
    guest_name: z.string().min(1, 'Guest name is required'),
    guest_phone: z.string().min(1, 'Guest phone is required'),
    guest_email: z.string().email('Invalid email address'),
    num_guests: z.number().min(1, 'At least 1 guest is required'),
    tour_date: z.date(),
    // guide_id: z.string().optional(),
    addons: z.array(z.object({
        name: z.string(),
        price: z.number().min(0),
    })).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

type Props = {
    guides: Guide[] | null;
    packages: TourPackage[] | null;
}

const CreateBooking = ({ guides, packages }: Props) => {

    const router = useRouter();
    const [selectedPackage, setSelectedPackage] = useState<TourPackage>();
    // const [addOns, setAddOns] = useState<Array<PackageAddOn>>([]);

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            package_id: '',
            guest_name: '',
            guest_phone: '',
            guest_email: '',
            num_guests: 1,
            // tour_date: '',
            // guide_id: '',
            addons: [],
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const { fields: addonFields, append: appendAddon, remove: removeAddon } = useFieldArray({
        control: form.control,
        name: 'addons',
    });

    const onSubmit = async (data: BookingFormData) => {
        try {
            await createBooking(JSON.stringify(data));
            toast.success('Booking created successfully');
            router.push(routes.bookings.index);
        } catch (error) {
            toast.error('Failed to create booking');
        }
    };

    const handlePackageChange = (package_id: string) => {
        const pkg = packages?.find(p => p._id === package_id);
        setSelectedPackage(pkg);
        form.setValue('package_id', package_id);

        if (pkg) {
            // Set end date based on package duration
            const startDate = form.getValues('tour_date');
            if (startDate) {
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + pkg.duration_hours - 1);
                // form.setValue('endDate', endDate);
            }
        }
    };

    const handleStartDateChange = (date: Date | undefined) => {
        if (date) {
            form.setValue('tour_date', date);

            // // Update end date if package is selected
            // if (selectedPackage) {
            //     const endDate = new Date(date);
            //     endDate.setDate(endDate.getDate() + selectedPackage.duration - 1);
            //     form.setValue('endDate', endDate);
            // }
        }
    };

    const calculateTotal = () => {
        if (!selectedPackage) return 0;

        let total = selectedPackage.base_price // * form.watch('participants');

        addonFields.forEach(addOn => {
            const packageAddOn = selectedPackage.addons.find((a: any) => a.name === addOn.name);
            if (packageAddOn) {
                total += packageAddOn.price
            }
        });

        return total;
    };

    return (
        <Form {...form}>
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
                                    <Label htmlFor="package_id">Tour Package *</Label>
                                    <Select onValueChange={handlePackageChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a package" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {packages?.map((pkg) => (
                                                <SelectItem key={pkg._id} value={pkg._id}>
                                                    <div className="flex flex-col items-start">
                                                        <span>{pkg.title}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {pkg.duration_hours} days •  {parseCurrency(pkg.base_price)}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.package_id && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.package_id.message}
                                        </p>
                                    )}
                                </div>

                                {/* <div className="space-y-2">
                                    <Label htmlFor="guide_id">Tour Guide (Optional)</Label>
                                    <Select onValueChange={(value) => form.setValue('guide_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a guide" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {guides?.filter(g => g.status === 'active').map((guide) => (
                                                <SelectItem key={guide._id} value={guide._id}>
                                                    <div className="flex flex-col items-start">
                                                        <span>{guide.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {guide.specialties.slice(0, 2).join(', ')}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div> */}
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
                                <FormField
                                    control={form.control}
                                    name="guest_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='space-y-2 items-center justify-between'>
                                                <FormLabel className='capitalize'>name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., Kwaku Mensah"
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="guest_email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='space-y-2 items-center justify-between'>
                                                    <FormLabel className='capitalize'>email *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="e.g., kwaku@kbonsu.com"
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guest_phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='space-y-2 items-center justify-between'>
                                                    <FormLabel className='capitalize'>Phone Number *</FormLabel>
                                                    <FormControl>
                                                        <PhoneInput
                                                            defaultCountry="GH"
                                                            placeholder="020 123 4567"
                                                            className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                        <Label>Booking Date *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !form.watch('tour_date') && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {form.watch('tour_date') ? (
                                                        format(form.watch('tour_date'), 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={form.watch('tour_date')}
                                                    onSelect={handleStartDateChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {form.formState.errors.tour_date && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.tour_date.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Add-ons */}
                        {selectedPackage && selectedPackage.addons.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Add-ons</CardTitle>
                                    <CardDescription>
                                        Optional extras for this package
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {selectedPackage.addons.map((addOn: PackageAddOn) => {
                                        const selectedAddOn = addonFields.find(a => a.name === addOn.name);
                                        return (
                                            <div key={addOn.name} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{addOn.name}</h4>
                                                    <p className="text-sm font-medium"> {parseCurrency(addOn.price)}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {selectedAddOn ? (
                                                        <>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => removeAddon(addonFields.findIndex(a => a.name === addOn.name))}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() => appendAddon(addOn)}
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
                                            <h4 className="font-medium">{selectedPackage.title}</h4>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Package price:</span>
                                                <span> {parseCurrency(selectedPackage.base_price)}</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal:</span>
                                                <span>{parseCurrency(selectedPackage.base_price)}</span>
                                            </div>

                                            {addonFields.map(addOn => {
                                                const packageAddOn = selectedPackage.addons.find((a: any) => a.name === addOn.name);
                                                if (!packageAddOn) return null;
                                                return (
                                                    <div key={addOn.name} className="flex justify-between text-sm text-muted-foreground">
                                                        <span>{packageAddOn.name} :</span>
                                                        <span> {parseCurrency(packageAddOn.price)}</span>
                                                    </div>
                                                );
                                            })}

                                            <Separator />

                                            <div className="flex justify-between font-medium">
                                                <span>Total:</span>
                                                <span>{parseCurrency(calculateTotal())}</span>
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
                                onClick={() => router.push(routes.bookings.index)}
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
        </Form>
    )
}

export default CreateBooking