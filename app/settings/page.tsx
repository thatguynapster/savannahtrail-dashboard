'use client';

import {
  Save,
  Users,
  Bell,
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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockUsers } from '@/data/dummy';
import { User, UserRole } from '@/types/auth';
import { format } from 'date-fns';
import { MoreHorizontal, Plus, Edit, Trash2, UserPlus } from 'lucide-react';

const profileSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  bookingAlerts: z.boolean(),
  paymentAlerts: z.boolean(),
  systemAlerts: z.boolean(),
});

const teamMemberSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'tour_guide', 'operations', 'finance', 'support'] as const),
});

type ProfileSettings = z.infer<typeof profileSettingsSchema>;
type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

// Mock current settings based on the current user
const mockProfileSettings: ProfileSettings = {
  name: `${mockUsers[0].firstName} ${mockUsers[0].lastName}`,
  email: mockUsers[0].email,
  role: mockUsers[0].role,
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  bookingAlerts: true,
  paymentAlerts: true,
  systemAlerts: true,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [teamMembers, setTeamMembers] = useState<User[]>(mockUsers);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  const profileForm = useForm<ProfileSettings>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: mockProfileSettings,
  });

  const notificationForm = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: mockNotificationSettings,
  });

  const teamMemberForm = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'support',
    },
  });

  const onProfileSubmit = async (data: ProfileSettings) => {
    try {
      // API call would go here
      console.log('Profile data:', data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const onNotificationSubmit = async (data: NotificationSettings) => {
    try {
      // API call would go here
      console.log('Notification data:', data);
      toast.success('Notification settings updated successfully');
    } catch (error) {
      toast.error('Failed to update notification settings');
    }
  };

  const onTeamMemberSubmit = async (data: TeamMemberFormData) => {
    try {
      if (editingMember) {
        // Update existing member
        const updatedMember: User = {
          ...editingMember,
          ...data,
        };
        setTeamMembers(prev => prev.map(member =>
          member.id === editingMember.id ? updatedMember : member
        ));
        toast.success('Team member updated successfully');
        setEditingMember(null);
      } else {
        // Add new member
        const newMember: User = {
          id: `USR${String(teamMembers.length + 1).padStart(3, '0')}`,
          ...data,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setTeamMembers(prev => [...prev, newMember]);
        toast.success('Team member added successfully');
      }
      setIsAddMemberOpen(false);
      teamMemberForm.reset();
    } catch (error) {
      toast.error('Failed to save team member');
    }
  };

  const handleEditMember = (member: User) => {
    setEditingMember(member);
    teamMemberForm.reset({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
    });
    setIsAddMemberOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('Team member removed successfully');
    } catch (error) {
      toast.error('Failed to remove team member');
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      tour_guide: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      operations: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      finance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      support: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    };
    return colors[role];
  };

  const getRoleDisplayName = (role: UserRole) => {
    const names = {
      admin: 'Administrator',
      tour_guide: 'Tour Guide',
      operations: 'Operations',
      finance: 'Finance',
      support: 'Support',
    };
    return names[role];
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, team members, and notification preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <Users className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="team">
              <UserPlus className="mr-2 h-4 w-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...profileForm.register('name')}
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register('email')}
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      {...profileForm.register('role')}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your role cannot be changed. Contact an administrator if you need role modifications.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Account Security</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable 2FA
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Change Password</Label>
                          <p className="text-sm text-muted-foreground">
                            Update your account password
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage team members and their roles
                  </CardDescription>
                </div>
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingMember(null);
                      teamMemberForm.reset();
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingMember
                          ? 'Update the team member details and role.'
                          : 'Add a new team member to your organization.'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={teamMemberForm.handleSubmit(onTeamMemberSubmit)} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...teamMemberForm.register('firstName')}
                          />
                          {teamMemberForm.formState.errors.firstName && (
                            <p className="text-sm text-red-500">
                              {teamMemberForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...teamMemberForm.register('lastName')}
                          />
                          {teamMemberForm.formState.errors.lastName && (
                            <p className="text-sm text-red-500">
                              {teamMemberForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...teamMemberForm.register('email')}
                        />
                        {teamMemberForm.formState.errors.email && (
                          <p className="text-sm text-red-500">
                            {teamMemberForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={teamMemberForm.watch('role')}
                          onValueChange={(value: UserRole) => teamMemberForm.setValue('role', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="tour_guide">Tour Guide</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                        {teamMemberForm.formState.errors.role && (
                          <p className="text-sm text-red-500">
                            {teamMemberForm.formState.errors.role.message}
                          </p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddMemberOpen(false);
                            setEditingMember(null);
                            teamMemberForm.reset();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={teamMemberForm.formState.isSubmitting}>
                          {editingMember ? 'Update Member' : 'Add Member'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={`${member.firstName} ${member.lastName}`} />
                          <AvatarFallback>
                            {member.firstName[0]}{member.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {member.firstName} {member.lastName}
                            </h4>
                            <Badge className={getRoleColor(member.role)}>
                              {getRoleDisplayName(member.role)}
                            </Badge>
                            {!member.isActive && (
                              <Badge variant="outline" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                            {member.lastLogin && (
                              <> • Last login {format(new Date(member.lastLogin), 'MMM dd, yyyy')}</>
                            )}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditMember(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            {member.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                    <h4 className="font-medium">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={notificationForm.watch('emailNotifications')}
                          onCheckedChange={(checked) =>
                            notificationForm.setValue('emailNotifications', checked)
                          }
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
                          checked={notificationForm.watch('bookingAlerts')}
                          onCheckedChange={(checked) =>
                            notificationForm.setValue('bookingAlerts', checked)
                          }
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
                          checked={notificationForm.watch('paymentAlerts')}
                          onCheckedChange={(checked) =>
                            notificationForm.setValue('paymentAlerts', checked)
                          }
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
                          checked={notificationForm.watch('systemAlerts')}
                          onCheckedChange={(checked) =>
                            notificationForm.setValue('systemAlerts', checked)
                          }
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
        </Tabs>
      </div>
    </MainLayout>
  );
}