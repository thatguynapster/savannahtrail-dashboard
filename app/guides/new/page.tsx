import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { MainLayout } from '@/components/layout/main-layout';
import CreateGuide from "@/components/guides/create-guide";
import { Button } from '@/components/ui/button';


export default function NewGuidePage() {

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/guides">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {/* Back to Guides */}
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

                <CreateGuide />
            </div>
        </MainLayout>
    );
}