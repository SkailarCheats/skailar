import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import AllReviews from "@/components/all-reviews";
import { getPayloadClient } from "@/get-payload";

const ReviewsPage = async () => {
    const payload = await getPayloadClient();

    const { docs: reviews } = await payload.find({
        collection: 'reviews',
        where: {
            featured: {
                equals: true
            }
        }
    })

    return (
        <MaxWidthWrapper>


            <section className="bg-background text-foreground">
                <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold md:text-4xl">Reviews</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviews.map(review => (
                            <AllReviews user={review.user ?? null} key={review.id} rating={review.rating} date={review.createdAt} description={review.description} />
                        ))}
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    )
}

export default ReviewsPage;
