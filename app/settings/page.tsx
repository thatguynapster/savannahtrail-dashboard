'use client';

import {
  Save,
  Building,
  CreditCard,
  Mail,
  Cloud,
  Bell,
  Shield,
  Globe,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/main-layout';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const companySettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxRate: z.number().min(0).max(100),
  currency: z.string().min(1, 'Currency is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

const integrationSettingsSchema = z.object({
  paystackPublicKey: z.string().optional(),
  paystackSecretKey: z.string().optional(),
  sendgridApiKey: z.string().optional(),
  awsAccessKey: z.string().optional(),
  awsSecretKey: z.string().optional(),
  awsBucket: z.string().optional(),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  bookingAlerts: z.boolean(),
  paymentAlerts: z.boolean(),
  systemAlerts: z.boolean(),
});

type CompanySettings = z.infer<typeof companySettingsSchema>;
type IntegrationSettings = z.infer<typeof integrationSettingsSchema>;
type NotificationSettings = z.infer<typeof notificationSettingsSchema>;

// Mock current settings
const mockCompanySettings: CompanySettings = {
  companyName: 'SavannahTrail Tours',
  email: 'info@savannahtrail.com',
  phone: '+233 30 123 4567',
  address: 'Accra, Ghana',
  website: 'https://savannahtrail.com',
  taxRate: 12.5,
  currency: 'GHS',
  timezone: 'GMT',
};

const mockIntegrationSettings: IntegrationSettings = {
  paystackPublicKey: 'pk_test_****',
  paystackSecretKey: 'sk_test_****',
  sendgridApiKey: 'SG.****',
  awsAccessKey: 'AKIA****',
  awsSecretKey: '****',
  awsBucket: 'savannahtrail-uploads',
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  bookingAlerts: true,
  paymentAlerts: true,
  systemAlerts: true,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');

  const companyForm = useForm<CompanySettings>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: mockCompanySettings,
  });

  const integrationForm = useForm<IntegrationSettings>({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues: mockIntegrationSettings,
  });

  const notificationForm = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: mockNotificationSettings,
  });

  const onCompanySubmit = async (data: CompanySettings) => {
    try {
      // API call would go here
      toast.success('Company settings updated successfully');
    } catch (error) {
      toast.error('Failed to update company settings');
    }
  };

  const onIntegrationSubmit = async (data: IntegrationSettings) => {
    try {
      // API call would go here
      toast.success('Integration settings updated successfully');
    } catch (error) {
      toast.error('Failed to update integration settings');
    }
  };

  const onNotificationSubmit = async (data: NotificationSettings) => {
    try {
      // API call would go here
      toast.success('Notification settings updated successfully');
    } catch (error) {
      toast.error('Failed to update notification settings');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage system configuration and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">
              <Building className="mr-2 h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Cloud className="mr-2 h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details and business settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        {...companyForm.register('companyName')}
                      // error={companyForm.formState.errors.companyName?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...companyForm.register('email')}
                      // error={companyForm.formState.errors.email?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        {...companyForm.register('phone')}
                      // error={companyForm.formState.errors.phone?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        {...companyForm.register('website')}
                      // error={companyForm.formState.errors.website?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      {...companyForm.register('address')}
                    // error={companyForm.formState.errors.address?.message}
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.1"
                        {...companyForm.register('taxRate', { valueAsNumber: true })}
                      // error={companyForm.formState.errors.taxRate?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        {...companyForm.register('currency')}
                      // error={companyForm.formState.errors.currency?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        {...companyForm.register('timezone')}
                      // error={companyForm.formState.errors.timezone?.message}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={companyForm.formState.isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Company Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Integration</CardTitle>
                  <CardDescription>
                    Configure Paystack payment gateway settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={integrationForm.handleSubmit(onIntegrationSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="paystackPublicKey">Paystack Public Key</Label>
                        <Input
                          id="paystackPublicKey"
                          type="password"
                          {...integrationForm.register('paystackPublicKey')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paystackSecretKey">Paystack Secret Key</Label>
                        <Input
                          id="paystackSecretKey"
                          type="password"
                          {...integrationForm.register('paystackSecretKey')}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={integrationForm.formState.isSubmitting}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Save Payment Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Integration</CardTitle>
                  <CardDescription>
                    Configure SendGrid for email notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sendgridApiKey">SendGrid API Key</Label>
                      <Input
                        id="sendgridApiKey"
                        type="password"
                        {...integrationForm.register('sendgridApiKey')}
                      />
                    </div>
                    <Button type="submit" disabled={integrationForm.formState.isSubmitting}>
                      <Mail className="mr-2 h-4 w-4" />
                      Save Email Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Storage</CardTitle>
                  <CardDescription>
                    Configure AWS S3 for file uploads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="awsAccessKey">AWS Access Key</Label>
                        <Input
                          id="awsAccessKey"
                          type="password"
                          {...integrationForm.register('awsAccessKey')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="awsSecretKey">AWS Secret Key</Label>
                        <Input
                          id="awsSecretKey"
                          type="password"
                          {...integrationForm.register('awsSecretKey')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awsBucket">S3 Bucket Name</Label>
                      <Input
                        id="awsBucket"
                        {...integrationForm.register('awsBucket')}
                      />
                    </div>
                    <Button type="submit" disabled={integrationForm.formState.isSubmitting}>
                      <Cloud className="mr-2 h-4 w-4" />
                      Save Storage Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          {...notificationForm.register('emailNotifications')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via SMS
                          </p>
                        </div>
                        <Switch
                          {...notificationForm.register('smsNotifications')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive browser push notifications
                          </p>
                        </div>
                        <Switch
                          {...notificationForm.register('pushNotifications')}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Alert Types</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Booking Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            New bookings, cancellations, and modifications
                          </p>
                        </div>
                        <Switch
                          {...notificationForm.register('bookingAlerts')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Payment Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Payment failures, refunds, and confirmations
                          </p>
                        </div>
                        <Switch
                          {...notificationForm.register('paymentAlerts')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            System errors, maintenance, and updates
                          </p>
                        </div>
                        <Switch
                          {...notificationForm.register('systemAlerts')}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={notificationForm.formState.isSubmitting}>
                    <Bell className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage security policies and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Session Management</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-logout after inactivity</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically log out users after 30 minutes of inactivity
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Require password change</Label>
                          <p className="text-sm text-muted-foreground">
                            Force users to change passwords every 90 days
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Access Control</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>IP Whitelist</Label>
                          <p className="text-sm text-muted-foreground">
                            Restrict access to specific IP addresses
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Require 2FA for all admin users
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button>
                    <Shield className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}