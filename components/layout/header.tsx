'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/lib/auth/auth-context';
import { useTheme } from 'next-themes';
import { Bell, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { NotificationPanel } from '@/components/notifications/notification-panel';
import clsx from "clsx";
import { mockUsers } from "@/data/dummy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const router = useRouter();
  // const { user, logout } = useAuth();
  const user = mockUsers[0];
  const { theme, setTheme } = useTheme();
  const [themeIcon, setThemeIcon] = useState(<Sun className="h-4 w-4" />);

  useEffect(() => {

    if (theme === 'dark') {
      setThemeIcon(<Sun className="h-4 w-4" />)
    } else {
      setThemeIcon(<Moon className="h-4 w-4" />)
    }

    return () => { setThemeIcon(<Sun className="h-4 w-4" />) }
  }, [theme])


  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      tour_guide: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      operations: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      finance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      support: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    };
    return colors[role as keyof typeof colors] || colors.support;
  };

  const logout = () => {
    // clear session storage
    sessionStorage.clear();

    // clear local storage
    localStorage.clear();

    router.push('/');
  };



  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4" />

      <div className="flex items-center space-x-4">
        <NotificationPanel />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {themeIcon}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.firstName} />
                <AvatarFallback>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <Badge className={clsx('w-fit mt-1', getRoleColor(user?.role || ''))}>
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}