import './global.css'
import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import { SidebarWrapper } from './components/sidebar-wrapper'
import Footer from './components/footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { baseUrl, siteName, siteConfig } from 'lib/site-config'
import { getFolderStructure } from './content/utils'
import { Toaster } from 'sonner'

const fontSans = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const fontSerif = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
})

const fontMono = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteName,
    description: siteConfig.description,
    url: baseUrl,
    siteName,
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const folderStructure = getFolderStructure()

  return (
    <html
      lang="en"
      className={cx(
        fontSans.variable,
        fontSerif.variable,
        fontMono.variable
      )}
    >
      <body className="antialiased">
        <div className="flex min-h-screen">
          <SidebarWrapper structure={folderStructure} />
          <main className="flex-1 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 pt-20 md:pt-12">
              {children}
              <Footer />
            </div>
          </main>
        </div>
        <Toaster position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
