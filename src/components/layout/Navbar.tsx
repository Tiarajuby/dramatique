'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Globe, Smartphone, LogIn, ChevronDown, X, Menu, Check } from 'lucide-react'
import { LANGUAGES, GENRES } from '@/types'
import LoginModal from '@/components/ui/LoginModal'
import { useAuthStore } from '@/store/authStore'
import { signOut } from '@/lib/auth'

function LanguageDropdown() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(LANGUAGES[0])
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-white hover:text-brand-red text-sm font-medium transition-colors px-2 py-1.5 rounded-md hover:bg-brand-card">
        <Globe size={15} className="text-white" />
        <span>{selected.flag} {selected.label}</span>
        <ChevronDown size={13} className={`text-white transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-brand-card border border-brand-border rounded-xl shadow-2xl z-50 py-1 animate-fade-in max-h-80 overflow-y-auto">
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => { setSelected(lang); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-brand-dark transition-colors text-left ${selected.code === lang.code ? 'text-brand-red font-semibold' : 'text-brand-text'}`}>
              <span>{lang.flag}</span>{lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoriesDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1 nav-link ${open ? 'text-brand-red' : ''}`}>
        Categories <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-52 bg-brand-card border border-brand-border rounded-xl shadow-2xl z-50 py-2 animate-fade-in">
          {GENRES.map(genre => (
            <Link key={genre} href={`/categories?genre=${encodeURIComponent(genre)}`} onClick={() => setOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-brand-text hover:text-white hover:bg-brand-dark transition-colors">
              {genre}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.focus()
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 animate-fade-in">
      <div className="w-full max-w-2xl mx-4">
        <div className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-2xl px-5 py-4">
          <Search size={20} className="text-white flex-shrink-0" />
          <input ref={ref} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search series, genres, stories..."
            className="flex-1 bg-transparent text-white placeholder-brand-muted text-lg outline-none" />
          <button onClick={onClose} className="text-brand-subtle hover:text-white"><X size={20} /></button>
        </div>
        {query && (
          <div className="mt-2 bg-brand-card border border-brand-border rounded-xl p-4 text-brand-subtle text-sm text-center">
            Searching for &quot;{query}&quot;...
          </div>
        )}
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link href="/" className="flex-shrink-0 group">
      <img
        src="/logo.png"
        alt="Dramatique"
        className="h-10 w-auto object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const fallback = e.currentTarget.nextElementSibling as HTMLElement
          if (fallback) fallback.style.display = 'block'
        }}
      />
      <div className="bg-brand-red px-2.5 py-1 rounded-md group-hover:bg-brand-redHover transition-colors hidden">
        <span className="font-display text-white font-black text-xl tracking-tight leading-none block">DRAMA</span>
        <span className="font-display text-white font-black text-xl tracking-tight leading-none block -mt-1">TIQUE</span>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const [mobileLang, setMobileLang] = useState(LANGUAGES[0])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black/95 backdrop-blur-md border-b border-brand-border' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex items-center gap-6 h-16">
            <Logo />
            <nav className="hidden md:flex items-center gap-6 flex-1">
              <CategoriesDropdown />
              <Link href="/new-hot" className="nav-link">New &amp; Hot</Link>
              <Link href="/blog" className="nav-link">Blog</Link>
            </nav>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-white hover:text-brand-red transition-colors rounded-lg hover:bg-brand-card">
                <Search size={18} className="text-white" />
              </button>
              <div className="hidden md:block"><LanguageDropdown /></div>
              <Link href="/download" className="hidden lg:flex items-center gap-1.5 bg-white text-black hover:bg-gray-100 font-bold px-5 py-2 rounded-md transition-colors text-sm">
                <Smartphone size={14} /> Download App
              </Link>
              {isLoggedIn ? (
                <Link href="/profile" className="hidden md:flex items-center gap-1.5 btn-primary">👤 Profile</Link>
              ) : (
                <button onClick={() => setLoginOpen(true)} className="hidden md:flex items-center gap-1.5 btn-primary">
                  <LogIn size={14} /> Log In
                </button>
              )}
              <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-white hover:text-brand-red transition-colors">
                <Menu size={22} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* MOBILE FULL MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-brand-black z-[90] md:hidden animate-fade-in overflow-y-auto">
          <div className="flex flex-col min-h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="text-white hover:text-brand-red transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* LANGUAGE — pulled to primary position at the top */}
            <div className="px-4 pt-5">
              <p className="text-brand-subtle text-xs uppercase tracking-widest mb-2.5 font-semibold flex items-center gap-1.5">
                <Globe size={13} /> Language
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setMobileLang(lang)}
                    className={`flex items-center gap-1.5 text-xs py-2.5 px-2 rounded-xl border transition-all ${mobileLang.code === lang.code ? 'bg-brand-red/15 border-brand-red/50 text-white font-semibold' : 'border-brand-border text-brand-text hover:border-brand-muted'}`}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.label}</span>
                    {mobileLang.code === lang.code && <Check size={11} className="text-brand-red ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* NAV LINKS */}
            <nav className="flex flex-col gap-1 p-4 mt-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/categories', label: 'Categories' },
                { href: '/new-hot', label: 'New & Hot' },
                { href: '/blog', label: 'Blog' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="text-white hover:text-brand-red text-lg font-medium px-3 py-3 rounded-lg hover:bg-brand-card transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* BOTTOM ACTIONS */}
            <div className="mt-auto p-4 border-t border-brand-border flex flex-col gap-3">
              <Link href="/download" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-bold px-5 py-3 rounded-xl transition-colors text-sm">
                <Smartphone size={16} /> Download App
              </Link>
              {isLoggedIn ? (
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="btn-primary text-center py-3">👤 My Profile</Link>
              ) : (
                <button onClick={() => { setMobileOpen(false); setLoginOpen(true) }} className="btn-primary text-center py-3">
                  Log In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
