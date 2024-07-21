import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { formatDistanceToNow, parseISO } from "date-fns";

const PrivacyPolicyPage = () => {
    const editDate = parseISO('2024-07-21T17.31.326Z')
    const lastEdit = formatDistanceToNow(editDate, { addSuffix: true })

    return (
        <MaxWidthWrapper>
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Privacy Policy</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: {lastEdit}</p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Information We Collect</h2>
                        <p className="text-gray-700 dark:text-gray-300">We collect various types of information in connection with the services we provide, including:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Personal identification information (Name, email address, phone number, etc.)</li>
                            <li>Usage data (pages visited, time spent on the site, etc.)</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">How We Use Your Information</h2>
                        <p className="text-gray-700 dark:text-gray-300">We use the information we collect in various ways, including to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Sharing Your Information</h2>
                        <p className="text-gray-700 dark:text-gray-300">We may share your information with third parties in the following circumstances:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>With your consent</li>
                            <li>For external processing with trusted partners</li>
                            <li>For legal reasons</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Your Data Protection Rights</h2>
                        <p className="text-gray-700 dark:text-gray-300">Depending on your location, you may have the following rights regarding your personal data:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>The right to access – You have the right to request copies of your personal data.</li>
                            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Contact Us</h2>
                        <p className="text-gray-700 dark:text-gray-300">If you have any questions about this Privacy Policy, You can contact us:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>By email: <a href="mailto:privacy@skailar.com" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">privacy@skailar.com</a></li>
                        </ul>
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    )

}

export default PrivacyPolicyPage;
