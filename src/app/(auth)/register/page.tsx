/*
 * This component represents the registration page.
 * It allows users to create a new account by providing
 * their email and password. It handles form validation,
 * submission, and displays appropriate error messages.
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
import { useRouter } from "next/navigation";

const Page = () => {
    // Initializing router
    const router = useRouter();

    // Form handling using react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator), // Using Zod schema for form validation
    });

    // Mutation hook for creating a new user
    const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
        // Handling errors during user creation
        onError: (err) => {
            if (err.data?.code === "CONFLICT") {
                toast.error("Email already in use"); // Display error message for duplicate email
                return;
            }

            if (err instanceof ZodError) {
                toast.error(err.issues[0].message); // Display error message for Zod validation errors
                return;
            }

            toast.error('Something went wrong'); // Display generic error message
        },
        // Handling successful user creation
        onSuccess: ({ sentToEmail }) => {
            toast.success(`Verification Email sent to ${sentToEmail}`); // Display success message
            router.push('/verify-email?to=' + sentToEmail); // Redirect to email verification page
        }
    });

    // Function to handle form submission
    const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
        mutate({ email, password }); // Call user creation mutation with provided credentials
    };

    // Rendering the UI
    return (
        <>
            <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        {/* Skailar logo */}
                        <Image src='/logo.png' height='80' width='80' alt="Skailar Logo" />
                        
                        {/* Registration heading */}
                        <h1 className="text-2xl font-bold">Create an Account</h1>

                        {/* Link to login page */}
                        <Link href='/login' className={buttonVariants({ variant: 'link', className: "gap-1.5" })}>
                            Already have an Account? Login
                            {/* Arrow icon for visual indication */}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {/* Form for registration */}
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

                                {/* Registration button */}
                                <Button>Register</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page;