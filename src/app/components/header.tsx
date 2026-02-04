'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <nav className="relative z-10 w-full px-4 md:px-12 pt-14 pb-8">
      <div className="flex flex-col gap-8 md:flex-row items-center justify-between">
        <Link href="/" className="flex items-center gap-4 z-20 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 700 700"
            className="text-white size-6">
            <path
              fill="#fff"
              d="M350 440c49.706 0 90-40.294 90-90s-40.294-90-90-90-90 40.294-90 90 40.294 90 90 90Z"
            />
            <path fill="#fff" d="M635 635H65V295h20v320h530V85H295V65h340v570Z" />
          </svg>
          <span className="text-light tracking-[0.4em] uppercase text-white">Cluster 127</span>
        </Link>

        <div className="flex gap-8 p-4 md:gap-12 text-sm/4 md:tracking-[0.2em] uppercase text-white/50 [&_a]:hover:text-white [&_a]:transition-colors">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${pathname === item.href ? 'text-white' : ''}`}>
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/cluster-127"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-2">
            Github{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="800px"
              height="800px"
              viewBox="0 0 32 32"
              fill="none"
              className="size-4 relative -top-px">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M22 3h7v7M27.5 4.5L20 12M17 5H8a3 3 0 00-3 3v16a3 3 0 003 3h16a3 3 0 003-3v-9"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  )
}
