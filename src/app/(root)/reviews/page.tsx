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
            <section className="py-12">
                <div className="md:flex md:items-center md:justify-between mb-4">
                    <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">Reviews</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map(review => (
                        <AllReviews user={review.user ?? null} key={review.id} rating={review.rating} date={review.createdAt} description={review.description} />
                    ))}
                </div>
            </section>
        </MaxWidthWrapper>
    )
}

export default ReviewsPage;
