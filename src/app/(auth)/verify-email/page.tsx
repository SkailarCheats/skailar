/*
 * This component represents the page for verifying the email address.
 * It displays either the VerifyEmail component if a token is provided
 * in the search parameters, or a message indicating that a verification
 * email has been sent.
 */

import { VerifyEmail } from "@/components/verify-email";
import Image from "next/image";

// Interface defining props for the Page component
interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined } // Search parameters
}

// Define the VerifyEmailPage component
const VerifyEmailPage = ({ searchParams }: PageProps) => {
    // Extracting token and email address from search parameters
    const token = searchParams.token;
    const toEmail = searchParams.to;

    // Rendering the UI
    return (
        <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                {token && typeof token === "string" ? ( // If token exists and is a string, render VerifyEmail component
                    <div className="grid gap-6">
                        <VerifyEmail token={token} />
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-1">
                        <div className="relative mb-4 h-60 w-60 text-muted-foreground">
                            {/* Display image indicating email sent */}
                            <Image
                                src='/mail-sent.png'
                                fill
                                alt="Skailar email sent"
                            />
                        </div>

                        <h3 className="font-semibold text-2xl">Check your Email</h3>

                        {toEmail ? ( // If toEmail exists, display specific message
                            <p className="text-muted-foreground text-center">
                                We&apos;ve sent a verification link to <span className="font-semibold">{toEmail}</span>.
                            </p>
                        ) : (
                            <p className="text-muted-foreground text-center">We&apos;ve sent a verification link to your email.</p> // Display default message
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmailPage;