/*
 * This component represents the login page.
 * It handles user authentication using email and password.
 * Additionally, it provides options to switch between
 * reseller and buyer accounts, and displays appropriate
 * error messages when authentication fails.
 */

"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from 'react-hook-form';

import { AuthCredentialsValidator, TAuthCredentialsValidator } from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";

import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

// Define the Page component
const Page = () => {
    // Initializing router and search parameters
    const router = useRouter();
    const searchParams = useSearchParams();
    const isReseller = searchParams.get('as') === "reseller"; // Check if user is a reseller
    const origin = searchParams.get('origin'); // Get origin for redirection

    // Function to continue as a reseller
    const continueAsReseller = () => {
        router.push("?as=reseller");
    }

    // Function to continue as a buyer
    const continueAsBuyer = () => {
        router.replace("/login", undefined);
    }

    // Form handling using react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator), // Using Zod schema for form validation
    });

    // Mutation hook for signing in
    const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
        // Handling errors during sign-in
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") {
                toast.error('Invalid email or password'); // Display error message for invalid credentials
            }
        },
        // Handling successful sign-in
        onSuccess: () => {
            toast.success('Logged In Successfully'); // Display success message
            router.refresh(); // Refresh the page

            // Redirect based on origin and user type
            if (origin) {
                router.push(`/${origin}`);
                return;
            }
            if (isReseller) {
                router.push('/sell');
                return;
            }
            router.push('/');
        }
    });

    // Function to handle form submission
    const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
        signIn({ email, password }); // Call sign-in mutation with provided credentials
    };

    // Flag to determine if resellers are enabled
    const resellers = false;

    // Rendering the UI
    return (
        <>
            <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        {/* Skailar logo */}
                        <Image src='/logo.png' height='80' width='80' alt="Skailar Logo" />

                        {/* Login heading with dynamic text based on user type */}
                        <h1 className="text-2xl font-bold">Login to your {isReseller && 'reseller'} account</h1>

                        {/* Link to register page */}
                        <Link href='/register' className={buttonVariants({ variant: 'link', className: "gap-1.5" })}>
                            Don&apos;t have an Account? Register
                            {/* Arrow icon for visual indication */}
                            <ArrowRight className="h-4 w-4" /> 
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {/* Form for login */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-2">
                                <div className="grid gap-1 py-2">
                                    {/* Label for email input */}
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        {...register("email")}
                                        className={cn({
                                            "focus-visible:ring-red-500": errors.email // Dynamic class based on email input validation state
                                        })}
                                        placeholder="you@example.com"
                                        autoComplete="off"
                                    />
                                    {errors?.email && ( // Display error message for invalid email
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-1 py-2">
                                    {/* Label for password input */}
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        {...register("password")}
                                        className={cn({
                                            "focus-visible:ring-red-500": errors.password // Dynamic class based on password input validation state
                                        })}
                                        placeholder="••••••••"
                                        type="password"
                                        autoComplete="off"
                                    />
                                    {errors?.password && ( // Display error message for invalid password
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>
                                
                                {/* Login button */}
                                <Button>Login</Button>
                            </div>
                        </form>

                        {resellers && ( // Display reseller options if enabled
                            <>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span aria-hidden='true' className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            or
                                        </span>
                                    </div>
                                </div>

                                {isReseller ? ( // Display appropriate button based on user type
                                    <Button onClick={continueAsBuyer} variant='secondary' disabled={isLoading}>Continue as Customer</Button>
                                ) : (
                                    <Button onClick={continueAsReseller} variant='secondary' disabled={isLoading}>Continue as Reseller</Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page;