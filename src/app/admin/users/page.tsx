'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminTable, TR, TD, AdminBadge, AdminSearchBar, AdminBtn, TableSkeleton } from '@/components/admin/AdminUI'
import { useAdminUsers } from '@/hooks/admin/useAdminQueries'
import { Eye, Coins, Crown, Ban } from 'lucide-react'
import Link from 'next/link'

export default function UserManagerPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'vip' | 'non-vip'>('all')

  const { data, isLoading } = useAdminUsers({ search, segment: filter })
  const filtered = data?.items || []
  const total = data?.total ?? 0

  return (
    <AdminLayout>
      <AdminPageHeader title="User Manager" subtitle={`${total} registered users`} />

      <AdminSearchBar placeholder="Search by name, phone, email..." value={search} onChange={setSearch}>
        <select value={filter} onChange={e => setFilter(e.target.value as 'all' | 'vip' | 'non-vip')}
          className="bg-[#15151d] border border-[#24242f] rounded-xl px-3 py-2.5 text-[#c2c2ce] text-sm outline-none focus:border-[#e8001d]">
          <option value="all">All Users</option>
          <option value="vip">VIP Only</option>
          <option value="non-vip">Non-VIP</option>
        </select>
      </AdminSearchBar>

      {isLoading ? (
        <TableSkeleton rows={5} cols={8} />
      ) : (
      <AdminTable headers={['User', 'Contact', 'Coins', 'VIP', 'Total Spent', 'Joined', 'Status', 'Actions']}>
        {filtered.map(u => (
          <TR key={u.id}>
            <TD>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e8001d]/20 flex items-center justify-center text-[#e8001d] text-xs font-black flex-shrink-0">
                  {u.display_name[0]}
                </div>
                <span className="text-white font-semibold text-sm">{u.display_name}</span>
              </div>
            </TD>
            <TD>
              <p className="text-[#c2c2ce] text-xs">{u.phone}</p>
              <p className="text-[#5a5a68] text-[10px]">{u.email}</p>
            </TD>
            <TD><span className="text-yellow-400 font-bold">🪙 {u.coins}</span></TD>
            <TD>
              {u.is_vip
                ? <div><AdminBadge label="VIP" color="yellow" /><p className="text-[#5a5a68] text-[10px] mt-0.5">Until {u.vip_until}</p></div>
                : <AdminBadge label="Free" color="gray" />
              }
            </TD>
            <TD><span className="text-green-400 font-semibold">₹{u.total_spent}</span></TD>
            <TD><span className="text-[#8b8b9a] text-xs">{u.joined}</span></TD>
            <TD><AdminBadge label={u.status} color="green" /></TD>
            <TD>
              <div className="flex items-center gap-1">
                <Link href={`/admin/users/${u.id}`} className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-white">
                  <Eye size={13} />
                </Link>
                <button className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-yellow-400" title="Add coins">
                  <Coins size={13} />
                </button>
                <button className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-yellow-400" title="Grant VIP">
                  <Crown size={13} />
                </button>
                <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-[#8b8b9a] hover:text-red-400" title="Ban">
                  <Ban size={13} />
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
