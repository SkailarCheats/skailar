import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { AllResellers } from "@/components/all-resellers";
import { getPayloadClient } from "@/get-payload";

const ReviewsPage = async () => {
    const payload = await getPayloadClient();
    const { docs: resellers } = await payload.find({
        collection: 'resellers',
    })

    return (
        <MaxWidthWrapper>
            <section className="bg-background text-foreground">
                <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold md:text-4xl">Verified Resellers</h2>
                        <p className="mt-2 text-muted-foreground md:text-lg">
                            These are our approved resellers who offer genuine products.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <AllResellers resellers={resellers || null} />
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    )
}

export default ReviewsPage;
