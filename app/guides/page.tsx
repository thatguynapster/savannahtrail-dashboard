import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import GuidesTable from "@/components/guides/table";
import { Button } from '@/components/ui/button';
import { guidesApi } from "@/lib/api/guides";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function GuidesPage({ searchParams }: Props) {
  const page = searchParams['page'] ?? '1'

  const { responses: { docs: guides, total, pages, limit }, ...data } = await guidesApi.getGuides(+page);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tour Guides</h1>
            <p className="text-muted-foreground">
              Manage tour guides and their availability
            </p>
          </div>
          <Button asChild>
            <Link href="/guides/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Guide
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Active Guides</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {guidesData.filter(g => g.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">On Leave</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {guidesData.filter(g => g.status === 'on_leave').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {(guidesData.reduce((sum, g) => sum + g.rating, 0) / guidesData.length).toFixed(1)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Tours</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {guidesData.reduce((sum, g) => sum + g.totalTours, 0)}
              </div>
            </CardContent>
          </Card>
        </div> */}

        <Card>
          <CardHeader>
            <CardTitle>All Guides</CardTitle>
            <CardDescription>
              Manage tour guides, their profiles, and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GuidesTable {...{ guides }} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}