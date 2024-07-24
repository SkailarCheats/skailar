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

import { AuthRegisterCredentialsValidator, TAuthRegisterCredentialsValidator } from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";

import { getSellerBaseURL } from "@/lib/urls";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Page = () => {
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const searchParams = useSearchParams();
    const isReseller = searchParams.get("as") === "reseller";

    const continueAsBuyer = () => {
        router.replace('/register', undefined)
    }

    const continueAsReeller = () => {
        router.push('?as=reseller')
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TAuthRegisterCredentialsValidator>({
        resolver: zodResolver(AuthRegisterCredentialsValidator),
    });

    const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
        onError: (err) => {
            if (err.data?.code === "CONFLICT") {
                toast.error("Email or User already in use");
                return;
            }

            if (err instanceof ZodError) {
                toast.error(err.issues[0].message);
                return;
            }

            toast.error(`Something went wrong`);
        },
        onSuccess: ({ sentToEmail }) => {
            if (!isReseller) {
                toast.success(`Verification Email sent to ${sentToEmail}`);
                router.push('/verify-email?to=' + sentToEmail);
            } else {
                toast.warning('Account created. Please wait for admin approval.');
            }
        }
    });

    const onSubmit = async ({ username, email, password, website }: TAuthRegisterCredentialsValidator) => {
        try {
            // const { data: ipData } = await axios.get('https://ipinfo.io/json');
            const userData = {
                username,
                email,
                password,
                ...(isReseller && website ? { website } : {}),
                // ip: ipData.ip,
                // hostname: ipData.hostname,
                // city: ipData.city,
                // region: ipData.region,
                // country: ipData.country,
                // loc: ipData.loc,
                // org: ipData.org,
                // postal: ipData.postal,
                // timezone: ipData.timezone,
                ip: "",
                city: "",
                region: "",
                country: "",
                loc: "",
                org: "",
                postal: "",
                timezone: "",
                readme: "",
            };

            if (isReseller) {
                await axios.get(`${getSellerBaseURL}&type=addAccount&role=Reseller&user=${username}&pass=${password}&keylevels=${value}&email=${email}`);
                router.refresh();
                router.push('/login?as=reseller');
                mutate(userData);
            } else {
                await axios.get(`${getSellerBaseURL}&type=adduser&user=${username}&sub=default&expiry=700&pass=${password}`);
                mutate(userData);
            }
        } catch (error) {
            toast.error('Internal Error');
        }
    };

    return (
        <>
            <div className={cn("container pb-16 relative flex flex-col items-center justify-center lg:px-0", isReseller ? 'pt-10' : 'pt-20')}>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Image src='https://cdn.skailar.com/v1/assets/img/logo.png' height='80' width='80' alt="Skailar Logo" />
                        <h1 className="text-2xl font-bold">{isReseller ? 'Create a Reseller Account' : 'Create an Account'}</h1>
                        <Link href={`${isReseller ? '/login?as=reseller' : '/login'}`} className={buttonVariants({ variant: 'link', className: "gap-1.5" })}>
                            {isReseller ? 'Already have a Reseller Account? Login' : 'Already have an Account? Login'}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid gap-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-2">
                                <div className="grid gap-1 py-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        {...register("username")}
                                        className={cn({
                                            "focus-visible:ring-red-500": errors.username
                                        })}
                                        placeholder="username"
                                        autoComplete="off"
                                    />
                                    {errors?.username && (
                                        <p className="text-sm text-red-500">{errors.username.message}</p>
                                    )}
                                </div>
                                <div className="grid gap-1 py-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        {...register("email")}
                                        className={cn({
                                            "focus-visible:ring-red-500": errors.email
                                        })}
                                        placeholder="you@example.com"
                                        autoComplete="off"
                                    />
                                    {errors?.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="grid gap-1 py-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            {...register("password")}
                                            className={cn({
                                                "focus-visible:ring-red-500": errors.password
                                            })}
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="off"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        >
                                            {showPassword ? <FaEyeSlash className="w-4 h-4 text-muted-foreground" /> : <FaEye className="w-4 h-4 text-muted-foreground" />}
                                        </span>
                                    </div>
                                    {errors?.password && (
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                {isReseller && (
                                    <div className="grid gap-1 py-2">
                                        <Label htmlFor="store">Your Store Link</Label>
                                        <Input
                                            {...register("website")}
                                            className={cn({
                                                "focus-visible:ring-red-500": errors.website
                                            })}
                                            placeholder="https://your-domain.com"
                                            type="text"
                                            autoComplete="off"
                                        />
                                    </div>
                                )}
                                <Button type="submit">Register</Button>
                            </div>
                        </form>

                        <div className='relative'>
                            <div
                                aria-hidden='true'
                                className='absolute inset-0 flex items-center'>
                                <span className='w-full border-t' />
                            </div>
                            <div className='relative flex justify-center text-xs uppercase'>
                                <span className='bg-background px-2 text-muted-foreground'>
                                    or
                                </span>
                            </div>
                        </div>

                        {isReseller ? (
                            <Button
                                onClick={continueAsBuyer}
                                variant='secondary'
                                disabled={isLoading}>
                                Continue as customer
                            </Button>
                        ) : (
                            <Button
                                onClick={continueAsReeller}
                                variant='secondary'
                                disabled={isLoading}>
                                Continue as reseller
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;
