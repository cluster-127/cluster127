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
    <nav className="w-full flex flex-col gap-8 md:flex-row items-center justify-between md:gap-4 px-8 md:px-16 absolute z-20 top-8 left-0 md:top-16">
      <Link href="/" className="flex items-center gap-4 z-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <rect x="2.5" y="2.5" width="19" height="19" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <rect x="1" y="1" width="4" height="4" fill="#050505" />
        </svg>
        <span className="font-mono tracking-[0.4em] uppercase text-white">Cluster 127</span>
      </Link>

      <div className="flex gap-8 md:gap-12 text-xs md:tracking-widest uppercase text-stone-500 [&_a]:hover:text-white [&_a]:transition-colors">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? 'text-white' : ''}>
            {item.label}
          </Link>
        ))}
        <a
          href="https://github.com/cluster-127"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors">
          Github
        </a>
      </div>
    </nav>
  )
}
