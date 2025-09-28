import { Plus } from "lucide-react"
import React from 'react'

import { TableSkeleton } from "@/components/loading/table-skeleton"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"

const Loading = () => {
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
                    <Button disabled>
                        <Plus className="mr-2 h-4 w-4" />
                        New Package
                    </Button>
                </div>
                <TableSkeleton
                    title="All Packages"
                    description="Loading packages data..."
                    rows={6}
                    columns={6}
                />
            </div>
        </MainLayout>
    )
}

export default Loading