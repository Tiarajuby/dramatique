'use client'

import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

// ── PAGE HEADER ──────────────────────────────────────
export function AdminPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-white font-bold text-2xl">{title}</h1>
        {subtitle && <p className="text-[#8b8b9a] text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ── STAT CARD ──────────────────────────────────────
export function StatCard({ label, value, sub, color = 'red', icon }: {
  label: string; value: string | number; sub?: string; color?: 'red' | 'green' | 'yellow' | 'blue' | 'purple'; icon?: string
}) {
  const colors = {
    red: 'text-[#e8001d]',
    green: 'text-emerald-400',
    yellow: 'text-amber-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  }
  return (
    <div className="bg-[#15151d] border border-[#24242f] rounded-xl p-5 transition-colors hover:border-[#32323f]">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[#8b8b9a] text-xs font-medium">{label}</p>
        {icon && <span className="text-base opacity-70">{icon}</span>}
      </div>
      <p className={`font-bold text-[26px] leading-none tracking-tight ${colors[color]}`}>{value}</p>
      {sub && <p className="text-[#5a5a68] text-xs mt-2">{sub}</p>}
    </div>
  )
}

// ── TABLE ──────────────────────────────────────
export function AdminTable({ headers, children, empty }: { headers: string[]; children: ReactNode; empty?: string }) {
  return (
    <div className="bg-[#15151d] border border-[#24242f] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#24242f]">
              {headers.map(h => (
                <th key={h} className="text-left px-4 py-3 text-[#5a5a68] text-xs uppercase tracking-wider font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {!children && empty && (
        <div className="text-center py-12 text-[#5a5a68] text-sm">{empty}</div>
      )}
    </div>
  )
}

export function TR({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr onClick={onClick} className={`border-b border-[#24242f] last:border-0 ${onClick ? 'cursor-pointer hover:bg-[#20202b]' : 'hover:bg-[#1a1a24]'} transition-colors`}>
      {children}
    </tr>
  )
}

export function TD({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-[#c2c2ce] ${className}`}>{children}</td>
}

// ── BADGE ──────────────────────────────────────
export function AdminBadge({ label, color }: { label: string; color: 'green' | 'red' | 'yellow' | 'blue' | 'gray' }) {
  const colors = {
    green: 'bg-green-500/15 text-green-400 border-green-500/20',
    red: 'bg-red-500/15 text-red-400 border-red-500/20',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    gray: 'bg-[#24242f] text-[#8b8b9a] border-[#2a2a3a]',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${colors[color]}`}>
      {label}
    </span>
  )
}

// ── SEARCH + FILTER BAR ──────────────────────────────────────
export function AdminSearchBar({ placeholder, value, onChange, children }: {
  placeholder: string; value: string; onChange: (v: string) => void; children?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      <div className="flex-1 min-w-48">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#15151d] border border-[#24242f] rounded-xl px-4 py-2.5 text-white placeholder-[#5a5a68] text-sm outline-none focus:border-[#e8001d] transition-colors"
        />
      </div>
      {children}
    </div>
  )
}

// ── FORM FIELD ──────────────────────────────────────
export function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[#c2c2ce] text-xs font-semibold uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-[#e8001d]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[#5a5a68] text-xs mt-1">{hint}</p>}
    </div>
  )
}

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-[#0a0a0f] border border-[#24242f] rounded-xl px-4 py-2.5 text-white placeholder-[#5a5a68] text-sm outline-none focus:border-[#e8001d] transition-colors"
    />
  )
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      {...props}
      className="w-full bg-[#0a0a0f] border border-[#24242f] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#e8001d] transition-colors"
    >
      {children}
    </select>
  )
}

export function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-[#0a0a0f] border border-[#24242f] rounded-xl px-4 py-2.5 text-white placeholder-[#5a5a68] text-sm outline-none focus:border-[#e8001d] transition-colors resize-none"
    />
  )
}

export function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-[#e8001d]' : 'bg-[#24242f]'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
      {label && <span className="text-[#c2c2ce] text-sm">{label}</span>}
    </div>
  )
}

// ── BREADCRUMB ──────────────────────────────────────
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#5a5a68] mb-5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={11} />}
          {item.href
            ? <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
            : <span className="text-[#808090]">{item.label}</span>
          }
        </div>
      ))}
    </div>
  )
}

// ── ACTION BUTTON ──────────────────────────────────────
export function AdminBtn({ children, onClick, variant = 'primary', size = 'md', href, type = 'button' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md'; href?: string; type?: 'button' | 'submit'
}) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-colors'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm' }
  const variants = {
    primary: 'bg-[#e8001d] hover:bg-[#c8001a] text-white',
    outline: 'border border-[#24242f] hover:border-[#5a5a68] text-[#c2c2ce] hover:text-white',
    danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20',
    ghost: 'text-[#8b8b9a] hover:text-white hover:bg-[#24242f]',
  }
  const cls = `${base} ${sizes[size]} ${variants[variant]}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button type={type} onClick={onClick} className={cls}>{children}</button>
}

// ── CARD ──────────────────────────────────────
export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[#15151d] border border-[#24242f] rounded-xl p-5 ${className}`}>
      {children}
    </div>
  )
}

// ── SECTION HEADER ──────────────────────────────────────
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white font-bold text-base">{title}</h2>
      {action}
    </div>
  )
}

// ── LOADING SKELETONS ──────────────────────────────────────
export function AdminSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#20202b] rounded ${className}`} />
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#15151d] border border-[#24242f] rounded-xl p-5">
      <AdminSkeleton className="h-3 w-20 mb-3" />
      <AdminSkeleton className="h-7 w-24" />
      <AdminSkeleton className="h-2.5 w-16 mt-2" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-[#15151d] border border-[#24242f] rounded-xl overflow-hidden">
      <div className="border-b border-[#24242f] px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => <AdminSkeleton key={i} className="h-3 flex-1" />)}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-b border-[#24242f] last:border-0 px-4 py-3.5 flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, c) => <AdminSkeleton key={c} className="h-4 flex-1" />)}
        </div>
      ))}
    </div>
  )
}
