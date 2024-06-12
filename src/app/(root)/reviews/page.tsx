import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";

const ReviewsPage = () => {
    return (
        <MaxWidthWrapper>
            <section className="py-12">
                <div className="md:flex md:items-center md:justify-between mb-4">
                    <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">Reviews</h1>
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    )
}

export default ReviewsPage;