import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import ReviewsPageClient from "@/components/reviews-page-client";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { Suspense } from "react";

const ReviewsPage = async () => {
    const payload = await getPayloadClient();

    const { docs: reviews } = await payload.find({
        collection: 'reviews',
        where: {
            featured: {
                equals: true
            }
        }
    });

    const nextCookies = cookies();
    const { user } = await getServerSideUser(nextCookies);

    const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
            and: [
                {
                    user: {
                        equals: user?.id,
                    },
                },
                {
                    _isPaid: {
                        equals: true,
                    },
                },
            ],
        },
    });

    const mappedReviews = reviews.map(review => ({
        id: review.id,
        user: review.user ? (typeof review.user === 'string' ? review.user : review.user) : null,
        rating: review.rating,
        createdAt: review.createdAt,
        description: review.description,
        featured: review.featured
    }));

    const [order] = orders;
    const products = order ? order.products : [];

    return (
        <MaxWidthWrapper>
            <Suspense>
                <ReviewsPageClient initialReviews={mappedReviews} initialOrders={orders} initialUser={user || null} products={products} />
            </Suspense>
        </MaxWidthWrapper>
    );
};

export default ReviewsPage;
