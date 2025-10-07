'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import CreatePackage from "@/components/packages/create-package";
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';

export default function NewPackagePage() {

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/packages">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {/* Back to Packages */}
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

                <CreatePackage />
            </div>
        </MainLayout>
    );
}