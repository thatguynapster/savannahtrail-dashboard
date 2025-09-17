'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { useAuth } from '@/lib/auth/auth-context';
// import { hasPermission } from '@/lib/permissions';
import {
  LayoutDashboard,
  Calendar,
  Package,
  Users,
  CreditCard,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permission: 'view_dashboard',
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: Calendar,
    permission: 'view_bookings',
  },
  {
    title: 'Packages',
    href: '/packages',
    icon: Package,
    permission: 'view_packages',
  },
  {
    title: 'Guides',
    href: '/guides',
    icon: Users,
    permission: 'view_guides',
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: CreditCard,
    permission: 'view_payments',
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: AlertTriangle,
    permission: 'view_alerts',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    permission: 'view_settings',
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  // const { user } = useAuth();

  const filteredNavItems = navItems.filter(item =>
  // !item.permission || hasPermission(user?.role || 'support', item.permission)
  { }
  );

  return (
    <div className={cn(
      'relative flex flex-col border-r bg-background transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">SavannahTrail</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn('ml-auto', collapsed && 'mx-auto')}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    collapsed && 'px-2',
                    isActive && 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100'
                  )}
                >
                  <Icon className={cn('h-4 w-4', !collapsed && 'mr-2')} />
                  {!collapsed && item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}