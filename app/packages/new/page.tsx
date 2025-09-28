'use client';

import {
    ArrowLeft,
    Package,
    DollarSign,
    Clock,
    Users,
    Plus,
    Trash2,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { createTourPackage } from "@/lib/actions/packages";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { makeSlug } from "@/lib/utils";
import { routes } from "@/app/routes";

// Schema based on OpenAPI CreatePackageRequest
const packageSchema = z.object({
    title: z.string().min(1, 'Package title is required'),
    slug: z.string({ message: 'Provide a slug' }).refine((val) => makeSlug(val)),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    base_price: z.number().min(1, 'Base price must be greater than 0'),
    guest_limit: z.number().min(1, 'Guest limit must be at least 1'),
    extra_guest_fee: z.number().min(0, 'Extra guest fee cannot be negative'),
    duration_hours: z.number().min(1, 'Duration must be at least 1 hour'),
    addons: z.array(z.object({
        name: z.string().min(1, 'Add-on name is required'),
        price: z.number().min(0, 'Add-on price cannot be negative'),
    })),
});

type PackageFormData = z.infer<typeof packageSchema>;

export default function NewPackagePage() {
    const router = useRouter();

    const form = useForm<PackageFormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            title: '',
            slug: '',
            description: '',
            base_price: 0,
            guest_limit: 1,
            extra_guest_fee: 0,
            duration_hours: 4,
            addons: [],
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const { fields: addonFields, append: appendAddon, remove: removeAddon } = useFieldArray({
        control: form.control,
        name: 'addons',
    });

    const onSubmit = async (data: PackageFormData) => {
        try {
            await createTourPackage(JSON.stringify(data));

            toast.success('Package created successfully');
            router.push(routes.packages.index);
        } catch (error) {
            toast.error('Failed to create package');
        }
    };

    const addNewAddon = () => {
        appendAddon({
            name: '',
            price: 0,
        });
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/packages">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {/* Back to Packages */}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Create New Package</h1>
                            <p className="text-muted-foreground">
                                Design a new tour package for your customers
                            </p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Main Form */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Package className="h-5 w-5" />
                                            <span>Basic Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='space-y-2 items-center justify-between'>
                                                        <FormLabel className='capitalize'>package title *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Eg: Cape Coast Castle"
                                                                onChange={(ev) => {
                                                                    form.setValue('title', ev.target.value, { shouldValidate: true })
                                                                    // Update slug based on name
                                                                    const slug = makeSlug(ev.target.value)
                                                                    form.setValue('slug', slug, { shouldValidate: true })
                                                                }} />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='space-y-2 items-center justify-between'>
                                                        <FormLabel className='capitalize'>description *</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Detailed description of the tour package..."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Pricing & Capacity */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <DollarSign className="h-5 w-5" />
                                            <span>Pricing & Capacity</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="base_price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className='space-y-2 items-center justify-between'>
                                                            <FormLabel className='capitalize'>Base Price (GHS) *</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    type="number"
                                                                    min="1"
                                                                    step="0.01"
                                                                    placeholder="Eg: 150.00"
                                                                    {...form.register('base_price', { valueAsNumber: true })}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="guest_limit"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className='space-y-2 items-center justify-between'>
                                                            <FormLabel className='capitalize'>guest limit</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    type="number"
                                                                    min="1"
                                                                    placeholder="Eg: 150.00"
                                                                    {...form.register('guest_limit', { valueAsNumber: true })}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="extra_guest_fee"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className='space-y-2 items-center justify-between'>
                                                            <FormLabel className='capitalize'>extra guest fee (GHS) *</FormLabel>
                                                            <FormControl>
                                                                <>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        min="1"
                                                                        step="0.01"
                                                                        placeholder="Eg: 150.00"
                                                                        {...form.register('extra_guest_fee', { valueAsNumber: true })}
                                                                    />
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Additional fee per guest beyond the base limit
                                                                    </p>
                                                                </>
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="duration_hours"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className='space-y-2 items-center justify-between'>
                                                            <FormLabel className='capitalize'>duration (Hours) *</FormLabel>
                                                            <FormControl>
                                                                <>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        min="1"
                                                                        step="0.01"
                                                                        placeholder="Eg: 150.00"
                                                                        {...form.register('duration_hours', { valueAsNumber: true })}
                                                                    />
                                                                </>
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Add-ons */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Package Add-ons</CardTitle>
                                            <CardDescription>
                                                Optional extras customers can purchase
                                            </CardDescription>
                                        </div>
                                        <Button type="button" onClick={addNewAddon}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Add-on
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {addonFields.map((field, index) => (
                                            <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold">Add-on {index + 1}</h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeAddon(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`addons.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className='space-y-2 items-center justify-between'>
                                                                    <FormLabel className='capitalize'>name *</FormLabel>
                                                                    <FormControl>
                                                                        <>
                                                                            <Input
                                                                                {...field}
                                                                                placeholder="e.g., Professional Photography"

                                                                            />
                                                                        </>
                                                                    </FormControl>
                                                                </div>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name={`addons.${index}.price`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className='space-y-2 items-center justify-between'>
                                                                    <FormLabel className='capitalize'>price (GHS) *</FormLabel>
                                                                    <FormControl>
                                                                        <>
                                                                            <Input
                                                                                {...field}
                                                                                type="number"
                                                                                min="0"
                                                                                step="0.01"
                                                                                {...form.register(`addons.${index}.price`, { valueAsNumber: true })}

                                                                            />
                                                                        </>
                                                                    </FormControl>
                                                                </div>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {addonFields.length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>No add-ons configured yet.</p>
                                                <p className="text-sm">Add optional extras to increase revenue.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Summary Sidebar */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Package Summary</CardTitle>
                                        <CardDescription>
                                            Review the package details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium">
                                                {form.watch('title') || 'Package Title'}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {form.watch('description')?.substring(0, 100) || 'No description yet'}
                                                {form.watch('description')?.length > 100 && '...'}
                                            </p>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Base Price:</span>
                                                <span className="text-sm">
                                                    GHS {form.watch('base_price')?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Guest Limit:</span>
                                                <span className="text-sm">{form.watch('guest_limit') || 0}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Duration:</span>
                                                <span className="text-sm">{form.watch('duration_hours') || 0} hours</span>
                                            </div>
                                            {(form.watch('extra_guest_fee') ?? 0) > 0 && (
                                                <div className="flex items-center space-x-2">
                                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">Extra Guest Fee:</span>
                                                    <span className="text-sm">
                                                        GHS {form.watch('extra_guest_fee')?.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {addonFields.length > 0 && (
                                            <>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">Add-ons ({addonFields.length})</h4>
                                                    <div className="space-y-1">
                                                        {addonFields.map((_, index) => {
                                                            const name = form.watch(`addons.${index}.name`);
                                                            const price = form.watch(`addons.${index}.price`);
                                                            if (!name) return null;
                                                            return (
                                                                <div key={index} className="flex justify-between text-xs">
                                                                    <span>{name}</span>
                                                                    <span>GHS {price?.toLocaleString() || '0'}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
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
                                        {isSubmitting ? 'Creating...' : 'Create Package'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </MainLayout>
    );
}