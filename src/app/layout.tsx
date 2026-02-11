import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import Footer from './components/footer'
import Header from './components/header'
import './globals.css'

const sans = Figtree({
  variable: '--font-sans',
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
      <body
        className={`${sans.variable} antialiased bg-void relative min-h-screen flex flex-col text-white font-sans selection:bg-white selection:text-black`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
