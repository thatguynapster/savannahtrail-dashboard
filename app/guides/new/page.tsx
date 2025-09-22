'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    Globe,
    Award,
    Plus,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const guideSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    experience: z.number().min(0, 'Experience cannot be negative'),
    languages: z.array(z.string()).min(1, 'At least one language is required'),
    specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
    certifications: z.array(z.string()).min(1, 'At least one certification is required'),
    emergencyContact: z.object({
        name: z.string().min(1, 'Emergency contact name is required'),
        phone: z.string().min(1, 'Emergency contact phone is required'),
        relationship: z.string().min(1, 'Relationship is required'),
    }),
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

const commonCertifications = [
    'Wildlife Guide Certification', 'First Aid Certified', 'Cultural Guide Certification',
    'Tourism Board License', 'Adventure Guide Certification', 'Mountain Safety Course',
    'CPR Certified', 'Wilderness First Aid'
];

export default function NewGuidePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newLanguage, setNewLanguage] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');
    const [newCertification, setNewCertification] = useState('');

    const form = useForm<GuideFormData>({
        resolver: zodResolver(guideSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            bio: '',
            experience: 0,
            languages: [],
            specialties: [],
            certifications: [],
            emergencyContact: {
                name: '',
                phone: '',
                relationship: '',
            },
        },
    });

    const onSubmit = async (data: GuideFormData) => {
        try {
            setIsSubmitting(true);
            // API call would go here
            console.log('Guide data:', data);
            toast.success('Guide created successfully');
            router.push('/guides');
        } catch (error) {
            toast.error('Failed to create guide');
        } finally {
            setIsSubmitting(false);
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

    const addCertification = (certification: string) => {
        const currentCertifications = form.getValues('certifications');
        if (!currentCertifications.includes(certification)) {
            form.setValue('certifications', [...currentCertifications, certification]);
        }
        setNewCertification('');
    };

    const removeCertification = (certification: string) => {
        const currentCertifications = form.getValues('certifications');
        form.setValue('certifications', currentCertifications.filter(c => c !== certification));
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/guides">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Guides
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Add New Guide</h1>
                            <p className="text-muted-foreground">
                                Register a new tour guide to your team
                            </p>
                        </div>
                    </div>
                </div>

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
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                {...form.register('firstName')}
                                            />
                                            {form.formState.errors.firstName && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                {...form.register('lastName')}
                                            />
                                            {form.formState.errors.lastName && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.lastName.message}
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
                                                {...form.register('email')}
                                            />
                                            {form.formState.errors.email && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                {...form.register('phone')}
                                            />
                                            {form.formState.errors.phone && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.phone.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Years of Experience *</Label>
                                        <Input
                                            id="experience"
                                            type="number"
                                            min="0"
                                            {...form.register('experience', { valueAsNumber: true })}
                                        />
                                        {form.formState.errors.experience && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.experience.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Biography *</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us about the guide's background, experience, and what makes them special..."
                                            rows={4}
                                            {...form.register('bio')}
                                        />
                                        {form.formState.errors.bio && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.bio.message}
                                            </p>
                                        )}
                                    </div>
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

                            {/* Certifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Award className="h-5 w-5" />
                                        <span>Certifications</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Professional certifications and qualifications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {form.watch('certifications').map((certification) => (
                                            <Badge key={certification} variant="secondary" className="flex items-center space-x-1">
                                                <span>{certification}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCertification(certification)}
                                                    className="ml-1 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {commonCertifications
                                            .filter(cert => !form.watch('certifications').includes(cert))
                                            .map((certification) => (
                                                <Button
                                                    key={certification}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addCertification(certification)}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    {certification}
                                                </Button>
                                            ))}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Add custom certification..."
                                            value={newCertification}
                                            onChange={(e) => setNewCertification(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => newCertification && addCertification(newCertification)}
                                            disabled={!newCertification}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    {form.formState.errors.certifications && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.certifications.message}
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
                                        <Phone className="h-5 w-5" />
                                        <span>Emergency Contact</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Contact person in case of emergency
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="emergencyName">Contact Name *</Label>
                                        <Input
                                            id="emergencyName"
                                            {...form.register('emergencyContact.name')}
                                        />
                                        {form.formState.errors.emergencyContact?.name && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.emergencyContact.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="emergencyPhone">Phone Number *</Label>
                                        <Input
                                            id="emergencyPhone"
                                            {...form.register('emergencyContact.phone')}
                                        />
                                        {form.formState.errors.emergencyContact?.phone && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.emergencyContact.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="relationship">Relationship *</Label>
                                        <Input
                                            id="relationship"
                                            placeholder="e.g., Spouse, Parent, Sibling"
                                            {...form.register('emergencyContact.relationship')}
                                        />
                                        {form.formState.errors.emergencyContact?.relationship && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.emergencyContact.relationship.message}
                                            </p>
                                        )}
                                    </div>
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
                                    {isSubmitting ? 'Creating...' : 'Create Guide'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}