import { MainLayout } from "@/components/layout/main-layout"
import CreateGuide from "@/components/guides/create-guide";
import BackButton from "@/components/ui/back-button";
import { guidesApi } from "@/lib/api/guides";
import { routes } from "@/app/routes";

interface Props { params: { id: string } };

const EditGuidePage = async ({ params: { id } }: Props) => {

    const { response: guide } = await guidesApi.getGuide(id);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <BackButton link={routes.guides.index} />

                        <div>
                            <h1 className="text-3xl font-bold">Update Guide Details</h1>
                        </div>
                    </div>
                </div>

                <CreateGuide data={guide} />
            </div>
        </MainLayout>
    )
}

export default EditGuidePage