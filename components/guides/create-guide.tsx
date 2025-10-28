'use client'

import {
    Plus,
    Trash2,
    Images as ImagesIcon,
    User,
    Globe,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { toast } from 'sonner';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import * as Images from "@/components/images";
import { uploadFiles } from "@/lib/utils";
import { Guide } from "@/types/guide";
import { createGuide, updateGuide } from "@/lib/actions/guides";
import { routes } from "@/app/routes";

const guideSchema = z.object({
    name: z.string().min(1, 'First name is required'),
    email: z.email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    photo_url: z.string('Guide photo is required').optional(),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    languages: z.array(z.string()).min(1, 'At least one language is required'),
    specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
    status: z.enum(['active', 'inactive', 'on_leave']).optional(),
    // availability: z.array(z.object({
    //     date: z.date('Availability date is required'),
    // }))
});

type GuideFormData = z.infer<typeof guideSchema>;

const commonLanguages = [
    'English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese',
    'Twi', 'Ga', 'Ewe', 'Hausa', 'Dagbani', 'Fante'
];

const commonSpecialties = [
    'Wildlife Photography', 'Bird Watching', 'Cultural Tours', 'Historical Sites',
    'Adventure Tours', 'Hiking', 'Traditional Crafts', 'Northern Ghana',
    'Coastal Tours', 'Forest Reserves', 'National Parks'
];

const CreateGuide = ({ data: guideData }: { data?: Guide }) => {
    const router = useRouter();

    const [newLanguage, setNewLanguage] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');

    const form = useForm<GuideFormData>({
        resolver: zodResolver(guideSchema),
        defaultValues: {
            name: guideData?.name || '',
            email: guideData?.email || '',
            phone: guideData?.phone || '',
            bio: guideData?.bio || '',
            photo_url: guideData?.photo_url || '',
            languages: guideData?.languages || [],
            specialties: guideData?.specialties || [],
            status: guideData?.status || 'inactive',
            // availability: [{
            //     date: new Date()
            // }]
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const [newImages, setNewImages] = useState<(string | File)[]>(
        guideData ? [guideData.photo_url] : []
    );

    const onSubmit = async (data: GuideFormData) => {
        try {
            const formdata = new FormData();

            // check if there are new File objects to upload
            let uploadedImages: string[] = [];
            if (newImages.filter(img => img instanceof File).length > 0) {
                // upload only File objects
                const filesToUpload = newImages.filter(img => img instanceof File) as File[];
                filesToUpload.forEach(file => formdata.append("files", file));
                formdata.append("file_name", form.getValues('name'));

                uploadedImages = await uploadFiles(formdata)
                console.log(uploadedImages)
            }

            if (guideData) {
                const updateData = {
                    ...data,
                    _id: guideData._id,
                    photo_url: uploadedImages[0] ?? guideData.photo_url
                }
                delete (updateData as any).created_at;
                delete (updateData as any).__v;

                console.log('updateData:', updateData)

                // handle update logic here
                await updateGuide(JSON.stringify(updateData));
                toast.success('Guide updated successfully');
                return
            }

            await createGuide(JSON.stringify({ ...data, photo_url: uploadedImages[0] }))
            // console.log('created guide:', guide)

            toast.success('Guide created successfully')
            // router.push(routes.guides.index)

            // API call would go here
            console.log('Guide data:', data);

            toast.success('Guide created successfully');
            router.push('/guides');
        } catch (error) {
            toast.error('Failed to create guide');
        }
    };

    const addLanguage = (language: string) => {
        const currentLanguages = form.getValues('languages');
        if (!currentLanguages.includes(language)) {
            form.setValue('languages', [...currentLanguages, language]);
        }
        setNewLanguage('');
    };

    const removeLanguage = (language: string) => {
        const currentLanguages = form.getValues('languages');
        form.setValue('languages', currentLanguages.filter(l => l !== language));
    };

    const addSpecialty = (specialty: string) => {
        const currentSpecialties = form.getValues('specialties');
        if (!currentSpecialties.includes(specialty)) {
            form.setValue('specialties', [...currentSpecialties, specialty]);
        }
        setNewSpecialty('');
    };

    const removeSpecialty = (specialty: string) => {
        const currentSpecialties = form.getValues('specialties');
        form.setValue('specialties', currentSpecialties.filter(s => s !== specialty));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Form */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Personal Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='space-y-2 items-center justify-between'>
                                                <FormLabel className='capitalize'>Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Eg: Kwaku Bonsu"
                                                        {...form.register('name')}
                                                    // onChange={(ev) => {
                                                    //     form.setValue('name', ev.target.value, { shouldValidate: true })
                                                    //     // Update slug based on name
                                                    //     const slug = makeSlug(ev.target.value)
                                                    //     form.setValue('slug', slug, { shouldValidate: true })
                                                    // }} 
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
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='space-y-2 items-center justify-between'>
                                                    <FormLabel className='capitalize'>Email Address *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Eg: kwaku@kbonsu.com"
                                                            {...form.register('email')}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='space-y-2 items-center justify-between'>
                                                    <FormLabel className='capitalize'>Phone Number *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Eg: 233244123456"
                                                            {...form.register('phone')}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='space-y-2 items-center justify-between'>
                                                <FormLabel className='capitalize'>description *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us about the guide's background, experience, and what makes them special..."
                                                        {...field}
                                                        {...form.register('bio')}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Languages */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Globe className="h-5 w-5" />
                                    <span>Languages</span>
                                </CardTitle>
                                <CardDescription>
                                    Languages the guide can speak fluently
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {form.watch('languages').map((language) => (
                                        <Badge key={language} variant="secondary" className="flex items-center space-x-1">
                                            <span>{language}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeLanguage(language)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {commonLanguages
                                        .filter(lang => !form.watch('languages').includes(lang))
                                        .map((language) => (
                                            <Button
                                                key={language}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addLanguage(language)}
                                            >
                                                <Plus className="mr-1 h-3 w-3" />
                                                {language}
                                            </Button>
                                        ))}
                                </div>

                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Add custom language..."
                                        value={newLanguage}
                                        onChange={(e) => setNewLanguage(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => newLanguage && addLanguage(newLanguage)}
                                        disabled={!newLanguage}
                                    >
                                        Add
                                    </Button>
                                </div>

                                {form.formState.errors.languages && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.languages.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Specialties */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Specialties</CardTitle>
                                <CardDescription>
                                    Areas of expertise and tour types the guide specializes in
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {form.watch('specialties').map((specialty) => (
                                        <Badge key={specialty} variant="secondary" className="flex items-center space-x-1">
                                            <span>{specialty}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecialty(specialty)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {commonSpecialties
                                        .filter(spec => !form.watch('specialties').includes(spec))
                                        .map((specialty) => (
                                            <Button
                                                key={specialty}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addSpecialty(specialty)}
                                            >
                                                <Plus className="mr-1 h-3 w-3" />
                                                {specialty}
                                            </Button>
                                        ))}
                                </div>

                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Add custom specialty..."
                                        value={newSpecialty}
                                        onChange={(e) => setNewSpecialty(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => newSpecialty && addSpecialty(newSpecialty)}
                                        disabled={!newSpecialty}
                                    >
                                        Add
                                    </Button>
                                </div>

                                {form.formState.errors.specialties && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.specialties.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Emergency Contact Sidebar */}
                    <div className="space-y-6">
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
                                        form.setValue('photo_url', img.filter(i => typeof i === 'string')[0]);
                                    }}
                                />

                                <Images.Select
                                    multiple
                                    max={1}
                                    count={newImages.length}
                                    onImagesSelect={(files) => {
                                        // parent appends the new File[] into the mixed array
                                        setNewImages(prev => [...prev, ...files]);
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <>{form.formState.errors.bio?.message}</><br />
                        <>{form.formState.errors.email?.message}</><br />
                        <>{form.formState.errors.languages?.message}</><br />
                        <>{form.formState.errors.name?.message}</><br />
                        <>{form.formState.errors.phone?.message}</><br />
                        <>{form.formState.errors.photo_url?.message}</><br />
                        {/* <>{form.formState.errors.root?.message}</><br /> */}
                        <>{form.formState.errors.specialties?.message}</><br />
                        <>{form.formState.errors.status?.message}</>

                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.push(guideData ? routes.guides.view(guideData?._id) : routes.guides.index)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ?
                                    <>{guideData ? 'Updating...' : 'Creating...'}</> :
                                    <>{guideData ? 'Update Guide' : 'Create Guide'}</>
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default CreateGuide