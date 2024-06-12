import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { TERMS } from "@/lib/legal/terms";

import { formatDistanceToNow, parseISO } from "date-fns";

const TermsPage = () => {
    const editDate = parseISO('2024-06-12T17.31.326Z')
    const lastEdit = formatDistanceToNow(editDate, { addSuffix: true })

    return (
        <MaxWidthWrapper>
            <section className="py-12">
                <div className="md:flex md:items-center md:justify-between mb-4">
                    <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">Terms</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Last Edit: {lastEdit}</p>
                    </div>
                </div>

                <div className="relative">
                    <div className="mt-6 flex items-center w-full">
                        <div className="w-full">
                            {TERMS.map(term => (
                                <>
                                    <h1 className="mt-10 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
                                        {term.title}
                                    </h1>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {term.description}
                                    </p>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    )
}

export default TermsPage;