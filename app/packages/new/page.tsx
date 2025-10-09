'use client';

import CreatePackage from "@/components/packages/create-package";
import { MainLayout } from '@/components/layout/main-layout';
import BackButton from "@/components/ui/back-button";
import { routes } from "@/app/routes";

export default function NewPackagePage() {

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <BackButton link={routes.packages.index} />

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