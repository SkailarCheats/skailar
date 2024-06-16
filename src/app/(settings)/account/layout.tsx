import '../../globals.css'
import Providers from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { getServerSideUser } from '@/lib/payload-utils'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { Toaster } from 'sonner'
import { AccountMenuNav } from './_components/account-menu-nav'
import { AccountNav } from './_components/account-nav'
import { AccountdUserMenu } from './_components/account-user-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
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

  const titleWithUser = `${user?.username}'s Settings | Skailar`

  return (
    <html lang="en" className='h-full'>
      <head>
        <title>{titleWithUser}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
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
                    <AccountNav user={user!} />
                  </div>
                  <div className="flex flex-col h-screen">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed top-0 left-0 md:left-[220px] lg:left-[280px] right-0 z-10">
                      <AccountMenuNav user={user!} />
                      <div className="flex-grow w-full">
                        <form>
                          <div className="relative">
                            <h1 className="text-lg font-semibold">Account Dashboard</h1>
                          </div>
                        </form>
                      </div>
                      <AccountdUserMenu />
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