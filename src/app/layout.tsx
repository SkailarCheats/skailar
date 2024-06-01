import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/navbar'
import Providers from '@/components/providers'
import { Toaster } from 'sonner'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skailar',
  description: '',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-full'>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <body className={cn("relative h-full font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
