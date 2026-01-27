import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Footer from './components/footer'
import Header from './components/header'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Cluster 127',
  description: 'Architecting synthetic consciousness.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-void`}>
        <div className="relative min-h-screen flex flex-col text-white font-sans selection:bg-white selection:text-black">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
