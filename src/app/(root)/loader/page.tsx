/*
 * This component represents the loader page for downloading Skailar Loader.
 * It redirects the user to '/loader.exe' route using Next.js router when mounted.
 * The page includes a heading, a link to go back to the homepage, and styling
 * using Tailwind CSS classes.
 */

"use client";

import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoaderPage = () => {
    // Initializing router
    const router = useRouter();

    // Effect to redirect to '/Loader.exe' route when component is mounted
    useEffect(() => {
        router.replace('/Loader.exe');
    }, [router]); // Dependency array to run effect only once on component mount

    // Rendering the UI
    return (
        <MaxWidthWrapper> {/* Component for setting maximum width */}
            <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl'> {/* Container */}
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl'> {/* Heading */}
                    Download{' '}
                    <span className='text-purple-600'>Skailar</span>{' '} {/* Highlighted text */}
                    Loader.
                </h1>

                <div className='flex flex-col sm:flex-row gap-4 mt-6'> {/* Button container */}
                    <Link href='/' className={buttonVariants()}>Back to homepage</Link> {/* Link to homepage */}
                </div>
            </div>
            {/* End of maximum width wrapper */}
        </MaxWidthWrapper>
    );
}

export default LoaderPage;
