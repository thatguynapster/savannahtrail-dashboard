import { MainLayout } from "@/components/layout/main-layout"
import CreatePackage from "@/components/packages/create-package"
import { packagesApi } from "@/lib/api/packages";
import React from 'react'

interface Props { params: { id: string } };

const EditPackagePage = async ({ params: { id } }: Props) => {

    const { responses: pkg } = await packagesApi.getPackage(id);
    console.log('package:', pkg);

    return (
        <MainLayout>
            <CreatePackage data={pkg} />
        </MainLayout>
    )
}

export default EditPackagePage