'use client'

import {
    Button,
    buttonVariants,
} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import {
    AuthCredentialsValidator,
    TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState } from 'react'

const Page = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const isReseller = searchParams.get('as') === 'reseller'
    const origin = searchParams.get('origin')

    const [showPassword, setShowPassword] = useState(false)

    const continueAsReeller = () => {
        router.push('?as=reseller')
    }

    const continueAsBuyer = () => {
        router.replace('/login', undefined)
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator),
    })

    const { mutate: signIn, isLoading } =
        trpc.auth.signIn.useMutation({
            onSuccess: async () => {
                toast.success('Signed in successfully')

                router.refresh()

                if (origin) {
                    router.push(`/${origin}`)
                    return
                }

                router.push('/')
            },
            onError: (err) => {
                if (err.data?.code === 'UNAUTHORIZED') {
                    toast.error('Invalid email or password.')
                }
            },
        })

    const onSubmit = ({
        email,
        password,
    }: TAuthCredentialsValidator) => {
        signIn({ email, password })
    }

    return (
        <>
            <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                    <div className='flex flex-col items-center space-y-2 text-center'>
                        <Image src='https://cdn.skailar.com/v1/assets/img/logo.png' height='80' width='80' alt="Skailar Logo" />
                        <h1 className='text-2xl font-semibold tracking-tight'>
                            Login to your {isReseller ? 'reseller' : ''}{' '}
                            account
                        </h1>

                        <Link
                            className={buttonVariants({
                                variant: 'link',
                                className: 'gap-1.5',
                            })}
                            href='/register'>
                            Don&apos;t have an account?
                            <ArrowRight className='h-4 w-4' />
                        </Link>
                    </div>

                    <div className='grid gap-6'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='grid gap-2'>
                                <div className='grid gap-1 py-2'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        {...register('email')}
                                        className={cn({
                                            'focus-visible:ring-red-500':
                                                errors.email,
                                        })}
                                        placeholder='you@example.com'
                                        autoComplete='off'
                                    />
                                    {errors?.email && (
                                        <p className='text-sm text-red-500'>
                                            {errors.email.message}
                                        </p>
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

                                <Button disabled={isLoading}>
                                    {isLoading && (
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    )}
                                    Login
                                </Button>
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
    )
}

export default Page
