'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import {
    ArrowLeft,
    Package,
    MapPin,
    Clock,
    Users,
    DollarSign,
    Plus,
    Trash2,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const packageSchema = z.object({
    name: z.string().min(1, 'Package name is required'),
    shortDescription: z.string().min(1, 'Short description is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(1, 'Price must be greater than 0'),
    duration: z.number().min(1, 'Duration must be at least 1 day'),
    maxParticipants: z.number().min(1, 'Maximum participants must be at least 1'),
    minParticipants: z.number().min(1, 'Minimum participants must be at least 1'),
    difficulty: z.enum(['easy', 'moderate', 'challenging', 'extreme']),
    location: z.string().min(1, 'Location is required'),
    meetingPoint: z.string().min(1, 'Meeting point is required'),
    inclusions: z.array(z.string()).min(1, 'At least one inclusion is required'),
    exclusions: z.array(z.string()),
    requirements: z.array(z.string()),
    itinerary: z.array(z.object({
        day: z.number(),
        title: z.string().min(1, 'Day title is required'),
        description: z.string().min(1, 'Day description is required'),
        activities: z.array(z.string()),
    })).min(1, 'At least one day in itinerary is required'),
    addOns: z.array(z.object({
        name: z.string().min(1, 'Add-on name is required'),
        description: z.string().min(1, 'Add-on description is required'),
        price: z.number().min(0, 'Add-on price cannot be negative'),
        isRequired: z.boolean(),
    })),
    isPopular: z.boolean(),
    isFeatured: z.boolean(),
});

type PackageFormData = z.infer<typeof packageSchema>;

const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: 'Suitable for all fitness levels' },
    { value: 'moderate', label: 'Moderate', description: 'Requires basic fitness' },
    { value: 'challenging', label: 'Challenging', description: 'Requires good fitness' },
    { value: 'extreme', label: 'Extreme', description: 'Requires excellent fitness' },
];

export default function NewPackagePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [newInclusion, setNewInclusion] = useState('');
    const [newExclusion, setNewExclusion] = useState('');
    const [newRequirement, setNewRequirement] = useState('');

    const form = useForm<PackageFormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: '',
            shortDescription: '',
            description: '',
            price: 0,
            duration: 1,
            maxParticipants: 10,
            minParticipants: 2,
            difficulty: 'easy',
            location: '',
            meetingPoint: '',
            inclusions: [],
            exclusions: [],
            requirements: [],
            itinerary: [
                {
                    day: 1,
                    title: '',
                    description: '',
                    activities: [],
                },
            ],
            addOns: [],
            isPopular: false,
            isFeatured: false,
        },
    });

    const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
        control: form.control,
        name: 'itinerary',
    });

    const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
        control: form.control,
        name: 'addOns',
    });

    const onSubmit = async (data: PackageFormData) => {
        try {
            setIsSubmitting(true);
            // API call would go here
            console.log('Package data:', data);
            toast.success('Package created successfully');
            router.push('/packages');
        } catch (error) {
            toast.error('Failed to create package');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addInclusion = () => {
        if (newInclusion.trim()) {
            const currentInclusions = form.getValues('inclusions');
            form.setValue('inclusions', [...currentInclusions, newInclusion.trim()]);
            setNewInclusion('');
        }
    };

    const removeInclusion = (index: number) => {
        const currentInclusions = form.getValues('inclusions');
        form.setValue('inclusions', currentInclusions.filter((_, i) => i !== index));
    };

    const addExclusion = () => {
        if (newExclusion.trim()) {
            const currentExclusions = form.getValues('exclusions');
            form.setValue('exclusions', [...currentExclusions, newExclusion.trim()]);
            setNewExclusion('');
        }
    };

    const removeExclusion = (index: number) => {
        const currentExclusions = form.getValues('exclusions');
        form.setValue('exclusions', currentExclusions.filter((_, i) => i !== index));
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            const currentRequirements = form.getValues('requirements');
            form.setValue('requirements', [...currentRequirements, newRequirement.trim()]);
            setNewRequirement('');
        }
    };

    const removeRequirement = (index: number) => {
        const currentRequirements = form.getValues('requirements');
        form.setValue('requirements', currentRequirements.filter((_, i) => i !== index));
    };

    const addItineraryDay = () => {
        const currentItinerary = form.getValues('itinerary');
        appendItinerary({
            day: currentItinerary.length + 1,
            title: '',
            description: '',
            activities: [],
        });
    };

    const addActivity = (dayIndex: number, activity: string) => {
        if (activity.trim()) {
            const currentItinerary = form.getValues('itinerary');
            const updatedItinerary = [...currentItinerary];
            updatedItinerary[dayIndex].activities.push(activity.trim());
            form.setValue('itinerary', updatedItinerary);
        }
    };

    const removeActivity = (dayIndex: number, activityIndex: number) => {
        const currentItinerary = form.getValues('itinerary');
        const updatedItinerary = [...currentItinerary];
        updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
        form.setValue('itinerary', updatedItinerary);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/packages">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Packages
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

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                            <TabsTrigger value="addons">Add-ons</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="md:col-span-2 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <Package className="h-5 w-5" />
                                                <span>Basic Information</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Package Name *</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="e.g., Safari Adventure"
                                                    {...form.register('name')}
                                                />
                                                {form.formState.errors.name && (
                                                    <p className="text-sm text-red-500">
                                                        {form.formState.errors.name.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="shortDescription">Short Description *</Label>
                                                <Input
                                                    id="shortDescription"
                                                    placeholder="Brief description for listings"
                                                    {...form.register('shortDescription')}
                                                />
                                                {form.formState.errors.shortDescription && (
                                                    <p className="text-sm text-red-500">
                                                        {form.formState.errors.shortDescription.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">Full Description *</Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Detailed description of the tour package..."
                                                    rows={4}
                                                    {...form.register('description')}
                                                />
                                                {form.formState.errors.description && (
                                                    <p className="text-sm text-red-500">
                                                        {form.formState.errors.description.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="location">Location *</Label>
                                                    <Input
                                                        id="location"
                                                        placeholder="e.g., Mole National Park"
                                                        {...form.register('location')}
                                                    />
                                                    {form.formState.errors.location && (
                                                        <p className="text-sm text-red-500">
                                                            {form.formState.errors.location.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="meetingPoint">Meeting Point *</Label>
                                                    <Input
                                                        id="meetingPoint"
                                                        placeholder="e.g., Tamale Airport"
                                                        {...form.register('meetingPoint')}
                                                    />
                                                    {form.formState.errors.meetingPoint && (
                                                        <p className="text-sm text-red-500">
                                                            {form.formState.errors.meetingPoint.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <DollarSign className="h-5 w-5" />
                                                <span>Pricing & Capacity</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="price">Price (GHS) *</Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    min="1"
                                                    {...form.register('price', { valueAsNumber: true })}
                                                />
                                                {form.formState.errors.price && (
                                                    <p className="text-sm text-red-500">
                                                        {form.formState.errors.price.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="duration">Duration (Days) *</Label>
                                                <Input
                                                    id="duration"
                                                    type="number"
                                                    min="1"
                                                    {...form.register('duration', { valueAsNumber: true })}
                                                />
                                                {form.formState.errors.duration && (
                                                    <p className="text-sm text-red-500">
                                                        {form.formState.errors.duration.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid gap-4 grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="minParticipants">Min Participants *</Label>
                                                    <Input
                                                        id="minParticipants"
                                                        type="number"
                                                        min="1"
                                                        {...form.register('minParticipants', { valueAsNumber: true })}
                                                    />
                                                    {form.formState.errors.minParticipants && (
                                                        <p className="text-sm text-red-500">
                                                            {form.formState.errors.minParticipants.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                                                    <Input
                                                        id="maxParticipants"
                                                        type="number"
                                                        min="1"
                                                        {...form.register('maxParticipants', { valueAsNumber: true })}
                                                    />
                                                    {form.formState.errors.maxParticipants && (
                                                        <p className="text-sm text-red-500">
                                                            {form.formState.errors.maxParticipants.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Package Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="difficulty">Difficulty Level *</Label>
                                                <Select onValueChange={(value: any) => form.setValue('difficulty', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {difficultyOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                <div className="flex flex-col">
                                                                    <span>{option.label}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {option.description}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {form.formState.errors.difficulty && (
                                                    <p className="text-sm text-red-500">
                                                        {form.formState.errors.difficulty.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Popular Package</Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Mark as popular for featured listings
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={form.watch('isPopular')}
                                                    onCheckedChange={(checked) => form.setValue('isPopular', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Featured Package</Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Show in featured section
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={form.watch('isFeatured')}
                                                    onCheckedChange={(checked) => form.setValue('isFeatured', checked)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="itinerary" className="space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Tour Itinerary</CardTitle>
                                        <CardDescription>
                                            Plan the day-by-day activities for your tour
                                        </CardDescription>
                                    </div>
                                    <Button type="button" onClick={addItineraryDay}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Day
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {itineraryFields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">Day {index + 1}</h4>
                                                {itineraryFields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItinerary(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Day Title *</Label>
                                                    <Input
                                                        placeholder="e.g., Arrival and City Tour"
                                                        {...form.register(`itinerary.${index}.title`)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Activities</Label>
                                                    <div className="flex space-x-2">
                                                        <Input
                                                            placeholder="Add activity..."
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    const target = e.target as HTMLInputElement;
                                                                    addActivity(index, target.value);
                                                                    target.value = '';
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                                                                if (input?.value) {
                                                                    addActivity(index, input.value);
                                                                    input.value = '';
                                                                }
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description *</Label>
                                                <Textarea
                                                    placeholder="Describe what happens on this day..."
                                                    {...form.register(`itinerary.${index}.description`)}
                                                />
                                            </div>

                                            {form.watch(`itinerary.${index}.activities`)?.length > 0 && (
                                                <div className="space-y-2">
                                                    <Label>Activities</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {form.watch(`itinerary.${index}.activities`).map((activity, activityIndex) => (
                                                            <Badge key={activityIndex} variant="secondary" className="flex items-center space-x-1">
                                                                <span>{activity}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeActivity(index, activityIndex)}
                                                                    className="ml-1 hover:text-red-500"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="inclusions" className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span>Inclusions</span>
                                        </CardTitle>
                                        <CardDescription>
                                            What's included in the package price
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex space-x-2">
                                            <Input
                                                placeholder="Add inclusion..."
                                                value={newInclusion}
                                                onChange={(e) => setNewInclusion(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addInclusion();
                                                    }
                                                }}
                                            />
                                            <Button type="button" onClick={addInclusion}>
                                                Add
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            {form.watch('inclusions').map((inclusion, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                                    <span className="text-sm">{inclusion}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeInclusion(index)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        {form.formState.errors.inclusions && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.inclusions.message}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <XCircle className="h-5 w-5 text-red-500" />
                                            <span>Exclusions</span>
                                        </CardTitle>
                                        <CardDescription>
                                            What's not included in the package price
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex space-x-2">
                                            <Input
                                                placeholder="Add exclusion..."
                                                value={newExclusion}
                                                onChange={(e) => setNewExclusion(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addExclusion();
                                                    }
                                                }}
                                            />
                                            <Button type="button" onClick={addExclusion}>
                                                Add
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            {form.watch('exclusions').map((exclusion, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                                    <span className="text-sm">{exclusion}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeExclusion(index)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Requirements</CardTitle>
                                    <CardDescription>
                                        Important requirements for participants
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Add requirement..."
                                            value={newRequirement}
                                            onChange={(e) => setNewRequirement(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addRequirement();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addRequirement}>
                                            Add
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {form.watch('requirements').map((requirement, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                                                <span className="text-sm">{requirement}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeRequirement(index)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="addons" className="space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Package Add-ons</CardTitle>
                                        <CardDescription>
                                            Optional extras customers can purchase
                                        </CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => appendAddOn({
                                            name: '',
                                            description: '',
                                            price: 0,
                                            isRequired: false,
                                        })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Add-on
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {addOnFields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">Add-on {index + 1}</h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeAddOn(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Name *</Label>
                                                    <Input
                                                        placeholder="e.g., Professional Photography"
                                                        {...form.register(`addOns.${index}.name`)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Price (GHS) *</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        {...form.register(`addOns.${index}.price`, { valueAsNumber: true })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description *</Label>
                                                <Textarea
                                                    placeholder="Describe what this add-on includes..."
                                                    {...form.register(`addOns.${index}.description`)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Required Add-on</Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Automatically included for all bookings
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={form.watch(`addOns.${index}.isRequired`)}
                                                    onCheckedChange={(checked) => form.setValue(`addOns.${index}.isRequired`, checked)}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {addOnFields.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No add-ons configured yet.</p>
                                            <p className="text-sm">Add optional extras to increase revenue.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <div className="flex space-x-2">
                                {activeTab !== 'basic' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const tabs = ['basic', 'details', 'itinerary', 'inclusions', 'addons'];
                                            const currentIndex = tabs.indexOf(activeTab);
                                            if (currentIndex > 0) {
                                                setActiveTab(tabs[currentIndex - 1]);
                                            }
                                        }}
                                    >
                                        Previous
                                    </Button>
                                )}
                                {activeTab !== 'addons' ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const tabs = ['basic', 'details', 'itinerary', 'inclusions', 'addons'];
                                            const currentIndex = tabs.indexOf(activeTab);
                                            if (currentIndex < tabs.length - 1) {
                                                setActiveTab(tabs[currentIndex + 1]);
                                            }
                                        }}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Package'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Tabs>
                </form>
            </div>
        </MainLayout>
    );
}