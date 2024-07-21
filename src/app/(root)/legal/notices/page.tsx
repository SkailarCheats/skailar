import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { LEGAL_NOTICES } from "@/lib/legal/notices";
import { formatDistanceToNow, parseISO } from "date-fns";

const NoticesPage = () => {
    const editDate = parseISO('2024-07-21T17.31.326Z')
    const lastEdit = formatDistanceToNow(editDate, { addSuffix: true })

    return (
        <MaxWidthWrapper>
            <section className="py-12">
                <div className="md:flex md:items-center md:justify-between mb-4">
                    <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">Legal Notices</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Last Edit: {lastEdit}</p>
                    </div>
                </div>

                <div className="relative">
                    <div className="mt-6 flex items-center w-full">
                        <div className="w-full">
                            {LEGAL_NOTICES.map((notice, index) => (
                                <div key={index}>
                                    <h1 className="mt-10 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
                                        {notice.title}
                                    </h1>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {notice.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    )

}

export default NoticesPage;
