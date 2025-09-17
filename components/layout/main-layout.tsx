'use client';

// import { useAuth } from '@/lib/auth/auth-context';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Loader2 } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  // const { isLoading } = useAuth();

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}