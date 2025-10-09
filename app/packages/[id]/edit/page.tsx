import { MainLayout } from "@/components/layout/main-layout"
import CreatePackage from "@/components/packages/create-package"
import BackButton from "@/components/ui/back-button";
import { packagesApi } from "@/lib/api/packages";
import { routes } from "@/app/routes";

interface Props { params: { id: string } };

const EditPackagePage = async ({ params: { id } }: Props) => {

    const { responses: pkg } = await packagesApi.getPackage(id);
    console.log('package:', pkg);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <BackButton link={routes.packages.index} />

                        <div>
                            <h1 className="text-3xl font-bold">Update Package Details</h1>
                        </div>
                    </div>
                </div>

                <CreatePackage data={pkg} />
            </div>
        </MainLayout>
    )
}

export default EditPackagePage