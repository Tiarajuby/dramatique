'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminTable, TR, TD, AdminBadge, AdminSearchBar, AdminBtn } from '@/components/admin/AdminUI'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

const MOCK_POSTS = [
  { id: '1', title: 'Top 10 CEO Romance Series You Can\'t Stop Watching', category: 'CEO Romance', status: 'published', views: 12400, date: '14 Aug 2026' },
  { id: '2', title: 'Best Revenge Dramas of 2026 — Ranked', category: 'Revenge', status: 'published', views: 8700, date: '12 Aug 2026' },
  { id: '3', title: 'Why Micro Dramas Are Taking Over the World', category: 'Industry', status: 'published', views: 5200, date: '8 Aug 2026' },
  { id: '4', title: 'Your Complete Guide to Supernatural Romance', category: 'Supernatural', status: 'draft', views: 0, date: '15 Aug 2026' },
  { id: '5', title: 'New Series Alert — Dragon\'s Bride Season 2', category: 'Fantasy', status: 'draft', views: 0, date: '15 Aug 2026' },
]

export default function BlogManagerPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = MOCK_POSTS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Blog Manager"
        subtitle={`${MOCK_POSTS.length} posts`}
        action={<AdminBtn href="/admin/blog/new" variant="primary"><Plus size={14} /> New Post</AdminBtn>}
      />

      <AdminSearchBar placeholder="Search posts..." value={search} onChange={setSearch}>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-[#15151d] border border-[#24242f] rounded-xl px-3 py-2.5 text-[#c2c2ce] text-sm outline-none">
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </AdminSearchBar>

      <AdminTable headers={['Title', 'Category', 'Status', 'Views', 'Date', 'Actions']}>
        {filtered.map(post => (
          <TR key={post.id}>
            <TD><p className="text-white font-semibold text-sm line-clamp-1">{post.title}</p></TD>
            <TD><span className="text-[#e8001d] text-xs font-semibold">{post.category}</span></TD>
            <TD><AdminBadge label={post.status} color={post.status === 'published' ? 'green' : 'yellow'} /></TD>
            <TD>{post.views > 0 ? `${(post.views / 1000).toFixed(1)}K` : '—'}</TD>
            <TD><span className="text-[#5a5a68] text-xs">{post.date}</span></TD>
            <TD>
              <div className="flex gap-1">
                <Link href={`/blog/${post.id}`} target="_blank" className="p-1.5 hover:bg-[#24242f] rounded-lg text-[#8b8b9a] hover:text-white transition-colors">
                  <Eye size={13} />
                </Link>
                <Link href={`/admin/blog/${post.id}`} className="p-1.5 hover:bg-[#24242f] rounded-lg text-[#8b8b9a] hover:text-white transition-colors">
                  <Edit size={13} />
                </Link>
                <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#8b8b9a] hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </TD>
          </TR>
        ))}
      </AdminTable>
    </AdminLayout>
  )
}
