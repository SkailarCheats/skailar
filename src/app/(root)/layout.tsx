import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import Providers from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { cn, constructMetadata } from '@/lib/utils'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '../globals.css'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (process.env.MAINTENANCE! === 'true') {
    return (
      <html lang="en">
        <body>
          <div className="flex min-h-[100dvh] bg-black flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
              <Image src='https://cdn.skailar.com/favicon.ico' alt='logo' width={48} height={48} className='mx-auto h-12 w-12' />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Site Maintenance</h1>
              <p className="mt-4 text-muted-foreground">
                We&apos;re currently performing scheduled maintenance. The site will be back up and running shortly.
              </p>
            </div>
          </div>
        </body>
      </html>
    )
  }

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
              <Navbar />
              <div className="flex-grow flex-1">{children}</div>
              <Footer />
            </Providers>
          </main>
          <Toaster position='bottom-right' richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
