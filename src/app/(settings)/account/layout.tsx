import Providers from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { getServerSideUser } from '@/lib/payload-utils'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from "next/link"
import { Toaster } from 'sonner'
import '@/app/globals.css'
import { AccountNav } from './_components/account-nav'
import { AccountdUserMenu } from './_components/account-user-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skailar',
  description: '',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nextCookies = await cookies()
  const { user } = await getServerSideUser(nextCookies);

  return (
    <html lang="en" className='h-full'>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <body className={cn("relative h-full font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className='relative flex flex-col min-h-screen'>
            <Providers>
              <div className="grid min-h-screen w-full grid-cols-[280px_1fr] overflow-hidden">
                <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
                  <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                      <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
                        <Image src='/logo.png' width={24} height={24} alt='logo' />
                        <span>Skailar</span>
                      </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                      <AccountNav user={user!} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
                    <Link href="#" className="lg:hidden" prefetch={false}>
                      <UserIcon className="h-6 w-6" />
                      <span className="sr-only">Account</span>
                    </Link>
                    <div className="w-full flex-1">
                      <h1 className="text-lg font-semibold">Account Dashboard</h1>
                    </div>
                    <AccountdUserMenu />
                  </header>
                  <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                  </main>
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

function UserIcon(props: any) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}