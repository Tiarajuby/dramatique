'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { StatCard, StatCardSkeleton, AdminCard, SectionHeader, AdminBadge, AdminBtn, AdminSkeleton } from '@/components/admin/AdminUI'
import { useAdminDashboard, useAdminTransactions, useAdminUsers } from '@/hooks/admin/useAdminQueries'
import { Plus } from 'lucide-react'

export default function AdminDashboard() {
  const { stats: statsQ, chart: chartQ, top: topQ } = useAdminDashboard()
  const txnsQ = useAdminTransactions()
  const usersQ = useAdminUsers()

  const stats = statsQ.data
  const chart = chartQ.data || []
  const top = topQ.data || []
  const txns = txnsQ.data || []
  const users = usersQ.data?.items || []
  const maxRevenue = chart.length ? Math.max(...chart.map(d => d.revenue)) : 1

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-2xl">Dashboard</h1>
          <p className="text-[#8b8b9a] text-sm mt-0.5">Saturday, 15 August 2026</p>
        </div>
        <AdminBtn href="/admin/series/new" variant="primary"><Plus size={15} /> Add Series</AdminBtn>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsQ.isLoading || !stats
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : <>
              <StatCard label="Total Users" value={stats.users.total.toLocaleString()} sub={`+${stats.users.today} today`} color="blue" icon="👥" />
              <StatCard label="Revenue Today" value={`₹${(stats.revenue.today / 100).toLocaleString()}`} sub={`₹${(stats.revenue.month / 100).toLocaleString()} this month`} color="green" icon="💰" />
              <StatCard label="Active VIP" value={stats.vip.active.toLocaleString()} sub="Subscribers" color="yellow" icon="👑" />
              <StatCard label="Series Live" value={stats.series.published} sub={`${stats.series.draft} drafts`} color="red" icon="🎬" />
            </>
        }
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsQ.isLoading || !stats
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : <>
              <StatCard label="New Users" value={`+${stats.users.week}`} sub="Last 7 days" color="purple" icon="📈" />
              <StatCard label="Total Series" value={stats.series.total} sub={`${stats.series.published} published`} color="blue" icon="🎬" />
              <StatCard label="Coin Transactions" value={stats.coinTransactions.today} sub="Today" color="yellow" icon="🪙" />
              <StatCard label="Total Episodes" value={stats.episodes.total} sub="Across all series" color="green" icon="▶️" />
            </>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* REVENUE CHART */}
        <AdminCard className="lg:col-span-2">
          <SectionHeader title="Revenue — Last 14 Days" />
          {chartQ.isLoading
            ? <AdminSkeleton className="h-8 w-full" />
            : <div className="flex items-end gap-0.5 h-8">
                {chart.slice(-14).map((d, i) => (
                  <div key={i} className="flex-1 bg-[#e8001d]/60 rounded-sm" style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: 2 }} />
                ))}
              </div>
          }
          {stats && (
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#24242f]">
              <div className="text-center"><p className="text-emerald-400 font-bold text-lg">₹{(stats.revenue.today / 100).toLocaleString()}</p><p className="text-[#5a5a68] text-[10px]">Today</p></div>
              <div className="text-center"><p className="text-emerald-400 font-bold text-lg">₹{(stats.revenue.week / 100).toLocaleString()}</p><p className="text-[#5a5a68] text-[10px]">This Week</p></div>
              <div className="text-center"><p className="text-emerald-400 font-bold text-lg">₹{(stats.revenue.month / 100).toLocaleString()}</p><p className="text-[#5a5a68] text-[10px]">This Month</p></div>
            </div>
          )}
        </AdminCard>

        {/* TOP SERIES */}
        <AdminCard>
          <SectionHeader title="Top Series" action={<AdminBtn href="/admin/series" variant="ghost" size="sm">View all</AdminBtn>} />
          <div className="space-y-3">
            {topQ.isLoading
              ? Array.from({ length: 5 }).map((_, i) => <AdminSkeleton key={i} className="h-8 w-full" />)
              : top.map((s, i) => (
                  <div key={s.title} className="flex items-center gap-3">
                    <span className="text-[#e8001d] font-bold text-sm w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{s.title}</p>
                      <p className="text-[#5a5a68] text-[10px]">{(s.views / 1000000).toFixed(1)}M views</p>
                    </div>
                    <p className="text-emerald-400 text-xs font-bold flex-shrink-0">₹{(s.revenue / 100).toLocaleString()}</p>
                  </div>
                ))
            }
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* RECENT TRANSACTIONS */}
        <AdminCard>
          <SectionHeader title="Recent Transactions" action={<AdminBtn href="/admin/transactions" variant="ghost" size="sm">View all</AdminBtn>} />
          <div className="space-y-2">
            {txnsQ.isLoading
              ? Array.from({ length: 4 }).map((_, i) => <AdminSkeleton key={i} className="h-10 w-full" />)
              : txns.slice(0, 4).map(tx => (
                  <div key={tx.id} className="flex items-center gap-3 py-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#20202b] flex items-center justify-center text-sm flex-shrink-0">
                      {tx.type === 'purchase' ? '🪙' : tx.type === 'vip' ? '👑' : '📺'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{tx.user_name}</p>
                      <p className="text-[#5a5a68] text-[10px]">{tx.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-emerald-400 text-xs font-bold">₹{tx.amount_inr}</p>
                      <AdminBadge label={tx.status} color={tx.status === 'success' ? 'green' : 'red'} />
                    </div>
                  </div>
                ))
            }
          </div>
        </AdminCard>

        {/* RECENT USERS */}
        <AdminCard>
          <SectionHeader title="New Users" action={<AdminBtn href="/admin/users" variant="ghost" size="sm">View all</AdminBtn>} />
          <div className="space-y-2">
            {usersQ.isLoading
              ? Array.from({ length: 4 }).map((_, i) => <AdminSkeleton key={i} className="h-10 w-full" />)
              : users.slice(0, 4).map(u => (
                  <div key={u.id} className="flex items-center gap-3 py-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#e8001d]/20 flex items-center justify-center text-[#e8001d] text-xs font-bold flex-shrink-0">{u.display_name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{u.display_name}</p>
                      <p className="text-[#5a5a68] text-[10px]">{u.phone}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#c2c2ce] text-xs">🪙 {u.coins}</p>
                      {u.is_vip && <AdminBadge label="VIP" color="yellow" />}
                    </div>
                  </div>
                ))
            }
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  )
}
