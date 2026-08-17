'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminTable, TR, TD, AdminBadge, AdminSearchBar, AdminBtn, SectionHeader, TableSkeleton } from '@/components/admin/AdminUI'
import { useAdminSeries } from '@/hooks/admin/useAdminQueries'
import { Plus, Edit, Eye, Trash2, Copy } from 'lucide-react'
import Link from 'next/link'

export default function SeriesManagerPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useAdminSeries({ search, status: filter })
  const filtered = data?.items || []
  const total = data?.total ?? 0

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Series Manager"
        subtitle={`${total} total series`}
        action={<AdminBtn href="/admin/series/new" variant="primary"><Plus size={15} /> Add Series</AdminBtn>}
      />

      <AdminSearchBar placeholder="Search series..." value={search} onChange={setSearch}>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-[#15151d] border border-[#24242f] rounded-xl px-3 py-2.5 text-[#c2c2ce] text-sm outline-none focus:border-[#e8001d]">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </AdminSearchBar>

      {isLoading ? (
        <TableSkeleton rows={5} cols={8} />
      ) : (
      <AdminTable headers={['Series', 'Categories', 'Episodes', 'Lock Point', 'Views', 'Revenue', 'Status', 'Actions']}>
        {filtered.map(s => (
          <TR key={s.id}>
            <TD>
              <div>
                <p className="text-white font-semibold text-sm">{s.title}</p>
                <p className="text-[#5a5a68] text-xs mt-0.5">{s.language} · /{s.slug}</p>
              </div>
            </TD>
            <TD>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] bg-[#e8001d]/15 text-[#e8001d] px-1.5 py-0.5 rounded font-semibold">{s.primary_category}</span>
                {s.subcategories.map((sub: string) => (
                  <span key={sub} className="text-[10px] bg-[#24242f] text-[#8b8b9a] px-1.5 py-0.5 rounded">{sub}</span>
                ))}
              </div>
            </TD>
            <TD>{s.total_episodes}</TD>
            <TD>Ep {s.lock_from_episode}</TD>
            <TD>{s.views > 0 ? `${(s.views / 1000000).toFixed(1)}M` : '—'}</TD>
            <TD className="text-green-400 font-semibold">{s.revenue > 0 ? `₹${(s.revenue / 100).toLocaleString()}` : '—'}</TD>
            <TD>
              <AdminBadge
                label={s.status}
                color={s.status === 'published' ? 'green' : s.status === 'draft' ? 'yellow' : 'gray'}
              />
            </TD>
            <TD>
              <div className="flex items-center gap-1">
                <Link href={`/admin/series/${s.id}`} className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-white">
                  <Edit size={13} />
                </Link>
                <Link href={`/admin/series/${s.id}/episodes`} className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-white">
                  <Eye size={13} />
                </Link>
                <button className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-white">
                  <Copy size={13} />
                </button>
                <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-[#8b8b9a] hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            </TD>
          </TR>
        ))}
      </AdminTable>
      )}
    </AdminLayout>
  )
}
