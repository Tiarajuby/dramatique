'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Film, Play, Users, Coins, Crown,
  FileText, Bell, Settings, BarChart3, Tag, LogOut,
  Menu, X, ChevronRight, ChevronDown
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { fetchProfile } from '@/lib/auth'

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    label: 'Content', icon: Film, children: [
      { label: 'Series', href: '/admin/series', icon: Film },
      { label: 'Episodes', href: '/admin/series', icon: Play },
      { label: 'Blog', href: '/admin/blog', icon: FileText },
    ]
  },
  {
    label: 'Categories', icon: Tag, children: [
      { label: 'Categories', href: '/admin/categories', icon: Tag },
    ]
  },
  {
    label: 'Users & Money', icon: Users, children: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Transactions', href: '/admin/transactions', icon: Coins },
      { label: 'Coin Plans', href: '/admin/plans', icon: Coins },
      { label: 'VIP Plans', href: '/admin/plans', icon: Crown },
    ]
  },
  {
    label: 'Engage', icon: Bell, children: [
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    ]
  },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

function NavItem({ item, depth = 0 }: { item: any; depth?: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hasChildren = item.children?.length > 0
  const isActive = item.href && pathname === item.href
  const Icon = item.icon

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-admin-hover ${open ? 'text-white' : 'text-admin-subtle'}`}
        >
          <Icon size={16} />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-admin-border pl-3">
            {item.children.map((child: any) => (
              <NavItem key={child.href} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-admin-red text-white' : 'text-admin-subtle hover:bg-admin-hover hover:text-white'}`}
    >
      <Icon size={16} />
      {item.label}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) {
        setChecking(false)
        if (pathname !== '/admin/login') router.push('/admin/login')
        return
      }

      try {
        const profile = await fetchProfile(user.id)
        if (profile.is_admin) {
          setIsAuthed(true)
        } else if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      } catch {
        if (pathname !== '/admin/login') router.push('/admin/login')
      }
      setChecking(false)
    }
    checkAdminAccess()
  }, [pathname, router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e8001d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthed) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">

      {/* SIDEBAR — desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-[#15151d] border-r border-[#24242f] flex-shrink-0 fixed top-0 left-0 bottom-0 z-40">

        {/* LOGO */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#24242f]">
          <img src="/logo.png" alt="Dramatique" className="h-8 w-auto" onError={e => { e.currentTarget.style.display = 'none' }} />
          <div>
            <p className="text-white font-bold text-sm">Dramatique</p>
            <p className="text-[#404060] text-[10px] uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => <NavItem key={item.label} item={item} />)}
        </nav>

        {/* FOOTER */}
        <div className="p-3 border-t border-[#24242f]">
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8b8b9a] hover:text-white hover:bg-[#24242f] transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-[#15151d] border-r border-[#24242f] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#24242f]">
              <p className="text-white font-bold">Admin</p>
              <button onClick={() => setSidebarOpen(false)} className="text-[#8b8b9a] hover:text-white"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {NAV.map(item => <NavItem key={item.label} item={item} />)}
            </nav>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-[#15151d]/95 backdrop-blur border-b border-[#24242f] px-5 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-[#8b8b9a] hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#e8001d] flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-white text-sm font-medium hidden sm:block">Admin</span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
