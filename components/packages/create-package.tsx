'use client'

import {
    Package as PackageIcon,
    DollarSign,
    Clock,
    Users,
    Plus,
    Trash2,
    Images as ImagesIcon,
    ChevronUp,
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast } from 'sonner';
import { z } from 'zod';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createTourPackage, deleteTourPackage, updateTourPackage } from "@/lib/actions/packages";
import { Package, PackageStatus } from "@/types/package";
import { Separator } from '@/components/ui/separator';
import { useModal } from "@/providers/modal-provider";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ConfirmModal from "../ui/confirm-modal";
import { Input } from '@/components/ui/input';
import * as Images from "@/components/images";
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
    images: z.array(z.string(), { message: 'Provide at least one image URL' }).optional(),
    addons: z.array(z.object({
        name: z.string().min(1, 'Add-on name is required'),
        price: z.number().min(0, 'Add-on price cannot be negative'),
    })),
});

type PackageFormData = z.infer<typeof packageSchema>;

const CreatePackage = ({ data: packageData }: { data?: Package }) => {
    const { setOpen, setClose } = useModal();
    const router = useRouter();

    const form = useForm<PackageFormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            title: packageData?.title ?? '',
            slug: packageData?.slug ?? '',
            description: packageData?.description ?? '',
            base_price: packageData?.base_price ?? 0,
            guest_limit: packageData?.guest_limit ?? 1,
            extra_guest_fee: packageData?.extra_guest_fee ?? 0,
            duration_hours: packageData?.duration_hours ?? 4,
            images: packageData?.images ?? [],
            addons: packageData?.addons ?? [],
        },
    });

    // const images = form.watch('images') || []
    const [newImages, setNewImages] = useState<(string | File)[]>(packageData?.images || []);

    const isSubmitting = form.formState.isSubmitting;

    const { fields: addonFields, append: appendAddon, remove: removeAddon } = useFieldArray({
        control: form.control,
        name: 'addons',
    });

    const onSubmit = async (data: PackageFormData) => {
        try {
            const formdata = new FormData();

            // upload only File objects
            const filesToUpload = newImages.filter(img => img instanceof File) as File[];
            filesToUpload.forEach(file => formdata.append("files", file));

            // newImages.forEach(image => formdata.append("files", image));
            formdata.append("file_name", form.getValues('title'));

            try {
                const uploadedImages = await fetch(`${process.env['NEXT_PUBLIC_API_BASE_URL']}/extensions/file/upload-multiple`, {
                    method: "POST",
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: formdata,
                    redirect: "follow"
                })
                    .then((resp) => resp.json())
                    .then((res) => res.responses.map((img: any) => img.url))
                    .catch((error) => toast.error(error))

                if (packageData) {
                    const updateData = {
                        ...data, _id: packageData._id, images: [
                            ...(form.getValues('images') || []),
                            ...uploadedImages
                        ]
                    }
                    delete (updateData as any).created_at;
                    delete (updateData as any).__v;

                    // handle update logic here
                    await updateTourPackage(JSON.stringify(updateData));
                    toast.success('Package updated successfully');
                    return
                }

                await createTourPackage(JSON.stringify({
                    ...data, images: [
                        ...(form.getValues('images') || []),
                        ...uploadedImages
                    ]
                }));

                toast.success('Package created successfully');
                router.push(routes.packages.index);
            } catch (error) {
                toast.error('Image upload failed');
            }
        } catch (error) {
            toast.error('Failed to create package');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTourPackage(packageData?._id || '');
            toast.success('Package deleted successfully');
            router.push(routes.packages.index);
        } catch (error) {
            toast.error('Failed to delete package');
        } finally {
            setClose();
        }
    }

    const handleStatusUpdate = async (status: PackageStatus) => {
        try {
            await updateTourPackage(JSON.stringify({ _id: packageData?._id, status }));
            toast.success(`Package marked as ${status}`);
        } catch (error) {
            toast.error('Failed to delete package');
        } finally {
            setClose();
        }
    }

    const addNewAddon = () => {
        appendAddon({
            name: '',
            price: 0,
        });
    };

    const statuses: PackageStatus[] = ['active', 'inactive', 'draft'];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Form */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <PackageIcon className="h-5 w-5" />
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

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <ImagesIcon className="h-5 w-5" />
                                    <span>Images</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Images.Preview
                                    images={newImages}
                                    update={(img) => {
                                        // keep the whole mixed list in `newImages`
                                        setNewImages(img);
                                        // set the form field 'images' to be only the string URLs (existing remote images)
                                        form.setValue('images', img.filter(i => typeof i === 'string') as string[]);
                                    }}
                                />

                                <Images.Select
                                    multiple
                                    max={5}
                                    count={newImages.length}
                                    onImagesSelect={(files) => {
                                        // parent appends the new File[] into the mixed array
                                        setNewImages(prev => [...prev, ...files]);
                                    }}
                                />
                            </CardContent>
                        </Card>

                    </div>
                </div>
                <div className="flex w-full space-x-6 justify-between items-center">
                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setOpen(
                                <ConfirmModal
                                    cancel={{ text: 'No, Keep it' }}
                                    confirm={{
                                        variant: 'error',
                                        text: 'Yes, Delete',
                                        action: handleDelete
                                    }}
                                    confirmText={
                                        <>
                                            Are you sure you want to delete the package {packageData?.title}?
                                            <br />
                                            This action cannot be undone.
                                        </>
                                    }
                                />)}
                        >
                            Delete Package
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Status <ChevronUp className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {statuses.map((status: PackageStatus) =>
                                    packageData?.status !== status &&
                                    <DropdownMenuItem
                                        key={status}
                                        className="capitalize"
                                        onClick={() => { handleStatusUpdate(status) }}
                                    >
                                        {status}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

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
                            {isSubmitting ?
                                <>{packageData ? 'Updating...' : 'Creating...'}</> :
                                <>{packageData ? 'Update Package' : 'Create Package'}</>
                            }
                        </Button>
                    </div>
                </div>
            </form>
        </Form >
    )
}

export default CreatePackage