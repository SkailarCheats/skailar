import Providers from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '../../globals.css'

import { Input } from "@/components/ui/input"
import { ResellerMenuNav } from './_components/reseller-menu-nav'
import { ResellerNav } from './_components/reseller-nav'
import { ResellerUserMenu } from './_components/reseller-user-menu'
import { cookies } from 'next/headers'
import { getServerSideUser } from '@/lib/payload-utils'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Resellers | Skailar',
	description: '',
	icons: {
		icon: 'https://cdn.skailar.com/favicon.ico'
	}
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const nextCookies = await cookies()
	const { user } = await getServerSideUser(nextCookies)

	if (!user) redirect('/login?as=reseller')

	return (
		<html lang="en" className='h-full'>
			<head>
				<link rel="icon" type="image/x-icon" href="https://cdn.skailar.com/favicon.ico" />
			</head>
			<body className={cn("relative h-full font-sans antialiased", inter.className)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<main className='relative flex flex-col min-h-screen'>
						<Providers>
							<div className="flex-grow flex-1">
								<div className="grid min-h-screen h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
									<div className="hidden border-r bg-muted/40 md:block">
										<ResellerNav currentReseller={user?.username} />
									</div>
									<div className="flex flex-col h-screen">
										<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed top-0 left-0 md:left-[220px] lg:left-[280px] right-0 z-10 ">
											<ResellerMenuNav />
											<div className="flex-grow w-full">
												<form>
													<div className="relative">
														<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
														<Input
															type="search"
															placeholder="Search..."
															autoComplete='off'
															className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
														/>
													</div>
												</form>
											</div>
											<ResellerUserMenu />
										</header>
										<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto mt-14 lg:mt-[60px]">
											{children}
										</main>
									</div>
								</div>
							</div>
						</Providers>
					</main>
					<Toaster position='bottom-right' richColors />
				</ThemeProvider>
			</body>
		</html>
	)
}

function SearchIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	)
}
