import React from 'react'

import { DetailSkeleton } from "@/components/loading/detail-skeleton"
import { MainLayout } from "@/components/layout/main-layout"

const Loading = () => {
    return (
        <MainLayout>
            <DetailSkeleton />
        </MainLayout>
    )
}

export default Loading