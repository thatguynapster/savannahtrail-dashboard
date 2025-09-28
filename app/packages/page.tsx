import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import PackagesTable from "@/components/packages/table";
import { packagesApi } from "@/lib/api/packages";
import { Button } from '@/components/ui/button';




interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PackagesPage({ searchParams }: Props) {
  const page = searchParams['page'] ?? '0'
  const limit = 10;

  const { responses: { docs: packages, total, pages } } = await packagesApi.getPackages(+page, limit);
  console.log('packages:', packages);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Packages</h1>
            <p className="text-muted-foreground">
              Manage tour packages and their availability
            </p>
          </div>
          <Button asChild>
            <Link href="/packages/new">
              <Plus className="mr-2 h-4 w-4" />
              New Package
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Packages</CardTitle>
            <CardDescription>
              A list of all tour packages with their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PackagesTable {...{ packages }} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}