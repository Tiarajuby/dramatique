'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, BookMarked, User } from 'lucide-react'

const NAV = [
  { href: '/',           icon: Home,       label: 'Home' },
  { href: '/categories', icon: Compass,    label: 'Browse' },
  { href: '/my-list',    icon: BookMarked, label: 'My List' },
  { href: '/profile',    icon: User,       label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-black/90 backdrop-blur-xl border-t border-brand-border">
      <div className="flex items-center justify-around py-1.5 px-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-1 px-5 py-1.5 active:scale-90 transition-transform">
              {/* active indicator dot above the icon */}
              <span className={`absolute -top-1.5 w-1 h-1 rounded-full bg-brand-red transition-all duration-300 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
              <Icon size={22} className={`transition-colors duration-200 ${active ? 'text-brand-red' : 'text-brand-muted'}`} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? 'text-brand-red' : 'text-brand-muted'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
