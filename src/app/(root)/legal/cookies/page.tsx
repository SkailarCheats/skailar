import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { formatDistanceToNow, parseISO } from "date-fns"

const CookiesPage = () => {
    const editDate = parseISO('2024-07-21T17.31.326Z')
    const lastEdit = formatDistanceToNow(editDate, { addSuffix: true })

    return (
        <MaxWidthWrapper>
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Cookies Policy</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: {lastEdit}</p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">What are Cookies?</h2>
                        <p className="text-gray-700 dark:text-gray-300">Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide a better user experience, and understand how the website performs and analyze what works and where it needs improvement.</p>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">How We Use Cookies</h2>
                        <p className="text-gray-700 dark:text-gray-300">As most of the online services, our website uses cookies first-party and third-party cookies for several purposes. The first-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.</p>
                        <p className="text-gray-700 dark:text-gray-300">The third-party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure, providing advertisements that are relevant to you, and all in all providing you with a better and improved user experience and help speed up your future interactions with our website.</p>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Types of Cookies We Use</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong className="text-gray-900 dark:text-white">Necessary:</strong> Necessary cookies are essential for you to be able to experience the full functionality of our site. They allow us to maintain user sessions and prevent any security threats. They do not collect or store any personal information.</li>
                            <li><strong className="text-gray-900 dark:text-white">Statistics:</strong> These cookies store information like the number of visitors to the website, the number of unique visitors, which pages of the website have been visited, the source of the visit, etc. This data helps us understand and analyze how well the website performs and where it needs improvement.</li>
                            <li><strong className="text-gray-900 dark:text-white">Marketing:</strong> Our website displays advertisements. These cookies are used to personalize the advertisements that we show to you so that they are meaningful to you. These cookies also help us keep track of the efficiency of these ad campaigns.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Managing Cookies</h2>
                        <p className="text-gray-700 dark:text-gray-300">You can manage your cookies preferences by clicking on the "Settings" button and enabling or disabling the cookie categories on the popup according to your preferences.</p>

                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Contact Us</h2>
                        <p className="text-gray-700 dark:text-gray-300">If you have any questions about this Cookies Policy, You can contact us:</p>
                        <ul className="list-disc pl-5 mt-2">
                            <li>By email: <a href="mailto:cookies@skailar.com" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">cookies@skailar.com</a></li>
                        </ul>
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    )
}

export default CookiesPage;