import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFAB from '@/components/layout/WhatsAppFAB'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sreetv.com'),
  title: {
    default: 'Sree True Value — Premium Used Cars in Kakinada, Andhra Pradesh',
    template: '%s | Sree True Value',
  },
  description:
    'Find your perfect pre-owned car at Sree True Value, Kakinada\'s most trusted used car dealership. Browse certified used cars with warranty, exchange, and easy financing options.',
  keywords: [
    'used cars Kakinada',
    'pre-owned cars Kakinada',
    'second hand cars Andhra Pradesh',
    'certified used cars',
    'Sree True Value',
    'car dealership Kakinada',
    'buy used car Kakinada',
  ],
  authors: [{ name: 'Sree True Value' }],
  creator: 'Sree True Value',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Sree True Value',
    title: 'Sree True Value — Premium Used Cars in Kakinada',
    description: 'Kakinada\'s most trusted used car dealership. Browse certified pre-owned cars.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sree True Value — Premium Used Cars in Kakinada',
    description: 'Kakinada\'s most trusted used car dealership.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppFAB />
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4360749671061816"
          crossorigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
