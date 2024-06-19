"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from 'react-hook-form';

import { AuthRegisterCredentialsValidator, TAuthRegisterCredentialsValidator } from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";

const games = [
    {
        value: "1",
        label: "Rainbow Lite",
    },
    {
        value: "2",
        label: "Rust",
    },
    {
        value: "3",
        label: "Fortnite",
    },
    {
        value: "4",
        label: "Apex Legends",
    },
    {
        value: "5",
        label: "Valorant",
    },
    {
        value: "6",
        label: "Counter-Strike 2",
    },
    {
        value: "7",
        label: "Rainbow Full",
    },
]

const Page = () => {
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const searchParams = useSearchParams();
    const isReseller = searchParams.get("as") === "reseller";

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

    const onSubmit = async ({ username, email, password }: TAuthRegisterCredentialsValidator) => {
        try {
            const { data: ipData } = await axios.get('https://ipinfo.io/json');
            const userData = {
                username,
                email,
                password,
                ip: ipData.ip,
                hostname: ipData.hostname,
                city: ipData.city,
                region: ipData.region,
                country: ipData.country,
                loc: ipData.loc,
                org: ipData.org,
                postal: ipData.postal,
                timezone: ipData.timezone,
            };

            if (isReseller)
                await axios.get(`https://api.skailar.com/api/seller/?sellerkey=5d9da464a2530837e8cefc57245e1644&type=addAccount&role=Reseller&user=${username}&pass=${password}&keylevels=${value}&email=${email}`);

            mutate(userData);
        } catch (error) {
            toast.error('Internal Error');
        }
    };

    return (
        <>
            <div className={cn("container relative flex flex-col items-center justify-center lg:px-0", isReseller ? 'pt-10' : 'pt-20')}>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Image src='/logo.png' height='80' width='80' alt="Skailar Logo" />
                        <h1 className="text-2xl font-bold">{isReseller ? 'Create a Reseller Account' : 'Create an Account'}</h1>
                        <Link href='/login' className={buttonVariants({ variant: 'link', className: "gap-1.5" })}>
                            Already have an Account? Login
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
                                    <Input
                                        {...register("password")}
                                        className={cn({
                                            "focus-visible:ring-red-500": errors.password
                                        })}
                                        placeholder="••••••••"
                                        type="password"
                                        autoComplete="off"
                                    />
                                    {errors?.password && (
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                {isReseller && (
                                    <div className="grid gap-1 py-2">
                                        <Label htmlFor="game">Game</Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className={cn("w-full justify-between", !value && 'text-muted-foreground')}
                                                >
                                                    {value
                                                        ? games.find((game) => game.value === value)?.label
                                                        : "Select game..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search Game..." />
                                                    <CommandList>
                                                        <CommandEmpty>No game found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {games.map((game) => (
                                                                <CommandItem
                                                                    key={game.value}
                                                                    value={game.value}
                                                                    onSelect={(currentValue) => {
                                                                        setValue(currentValue === value ? "" : currentValue)
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            value === game.value ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {game.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}
                                <Button type="submit">Register</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;
