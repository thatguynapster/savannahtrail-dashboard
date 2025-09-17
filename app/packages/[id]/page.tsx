'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hasPermission } from '@/lib/permissions';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Clock,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Plus,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPackages, mockUsers } from "@/data/dummy";

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.id as string;
  // const { user } = useAuth();
  const user = mockUsers[0];

  // const { data: pkg, isLoading } = useQuery({
  //   queryKey: ['package', packageId],
  //   queryFn: () => packagesApi.getPackage(packageId),
  // });
  const pkg = mockPackages.find(p => p.id === packageId);

  // if (isLoading) {
  //   return (
  //     <MainLayout>
  //       <div className="flex items-center justify-center h-64">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
  //       </div>
  //     </MainLayout>
  //   );
  // }

  if (!pkg) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Package not found</h2>
          <p className="text-muted-foreground mt-2">The package you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/packages">Back to Packages</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      challenging: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      extreme: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const canEdit = hasPermission(user?.role || 'support', 'edit_packages');
  const canDelete = hasPermission(user?.role || 'support', 'delete_packages');

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
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">{pkg.name}</h1>
                {pkg.isPopular && <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />}
              </div>
              <p className="text-muted-foreground">
                Created on {format(new Date(pkg.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {canEdit && (
              <Button variant="outline" asChild>
                <Link href={`/packages/${pkg.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Package
                </Link>
              </Button>
            )}
            {canDelete && (
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Package
              </Button>
            )}
          </div>
        </div>

        {/* Package Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Package Overview</CardTitle>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(pkg.status)}>
                    {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                  </Badge>
                  <Badge className={getDifficultyColor(pkg.difficulty)}>
                    {pkg.difficulty.charAt(0).toUpperCase() + pkg.difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pkg.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Price:</span>
                    <span className="text-sm">GHS {pkg.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{pkg.duration} days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Capacity:</span>
                    <span className="text-sm">{pkg.minParticipants}-{pkg.maxParticipants} people</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Meeting Point:</span>
                    <span className="text-sm">{pkg.meetingPoint}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Available Dates</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {pkg.availableDates.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Next: {pkg.availableDates[0] ? format(new Date(pkg.availableDates[0]), 'MMM dd') : 'None'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Images</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {pkg.images.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pkg.images.filter(img => img.isPrimary).length} primary
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Add-ons</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {pkg.addOns.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pkg.addOns.filter(addon => addon.isRequired).length} required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <Card>
              <CardHeader>
                <CardTitle>Tour Itinerary</CardTitle>
                <CardDescription>
                  Day-by-day breakdown of the tour activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="border-l-2 border-orange-200 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </div>
                        <h4 className="font-semibold">{day.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {day.description}
                      </p>
                      <div className="space-y-1">
                        {day.activities.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
                            <span className="text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inclusions">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Included</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pkg.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span>Not Included</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pkg.exclusions.map((exclusion, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{exclusion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Package Images</CardTitle>
                  <CardDescription>
                    Manage photos and visual content for this package
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {pkg.images.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No images uploaded</h3>
                    <p className="text-muted-foreground mb-4">
                      Add images to showcase this package
                    </p>
                    {canEdit && (
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload First Image
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pkg.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-video relative overflow-hidden rounded-lg border">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {image.isPrimary && (
                            <Badge className="absolute top-2 left-2 bg-orange-500">
                              Primary
                            </Badge>
                          )}
                        </div>
                        {canEdit && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            <Button size="sm" variant="secondary">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 truncate">
                          {image.alt}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addons">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Package Add-ons</CardTitle>
                  <CardDescription>
                    Optional and required add-ons for this package
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {pkg.addOns.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No add-ons configured</p>
                    {canEdit && (
                      <Button className="mt-4" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Add-on
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pkg.addOns.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{addon.name}</h4>
                            {addon.isRequired && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {addon.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">GHS {addon.price.toLocaleString()}</div>
                          {canEdit && (
                            <div className="flex space-x-1 mt-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Availability Management</CardTitle>
                  <CardDescription>
                    Manage available and blocked dates for this package
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Update Dates
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">
                      Available Dates ({pkg.availableDates.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {pkg.availableDates.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No available dates set</p>
                      ) : (
                        pkg.availableDates.map((date) => (
                          <div key={date} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span className="text-sm">{format(new Date(date), 'MMM dd, yyyy')}</span>
                            {canEdit && (
                              <Button size="sm" variant="ghost">
                                <XCircle className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-red-700 dark:text-red-400">
                      Blocked Dates ({pkg.unavailableDates.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {pkg.unavailableDates.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No blocked dates</p>
                      ) : (
                        pkg.unavailableDates.map((date) => (
                          <div key={date} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span className="text-sm">{format(new Date(date), 'MMM dd, yyyy')}</span>
                            {canEdit && (
                              <Button size="sm" variant="ghost">
                                <XCircle className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>Package Requirements</CardTitle>
                <CardDescription>
                  Important information and requirements for participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pkg.requirements.length === 0 ? (
                  <p className="text-muted-foreground">No specific requirements</p>
                ) : (
                  <div className="space-y-2">
                    {pkg.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}