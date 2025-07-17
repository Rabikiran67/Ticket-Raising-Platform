
"use client";

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full"/>
        <div className="flex-1 container mx-auto p-8">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
