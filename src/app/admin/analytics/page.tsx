'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, StatCard, AdminCard, SectionHeader, AdminSkeleton } from '@/components/admin/AdminUI'
import {
  useAdminDashboard, useAdminGenrePerformance, useAdminVipSplit,
  useAdminProviderBreakdown, useAdminRevenueByPack, useAdminRevenueByGateway,
} from '@/hooks/admin/useAdminQueries'

const TABS = ['Overview', 'Content', 'Users', 'Revenue']

function BarChart({ data, color = '#e8001d' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-20 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all hover:opacity-80" style={{ height: `${(v / max) * 100}%`, backgroundColor: color, minHeight: 2 }} />
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [tab, setTab] = useState('Overview')
  const { stats, chart, top, isLoading: dashLoading } = useAdminDashboard()
  const { data: genreData = [], isLoading: genreLoading } = useAdminGenrePerformance()
  const { data: vipSplit, isLoading: vipLoading } = useAdminVipSplit()
  const { data: providers = [], isLoading: providersLoading } = useAdminProviderBreakdown()
  const { data: revenueByPack = [], isLoading: packLoading } = useAdminRevenueByPack()
  const { data: revenueByGateway = [], isLoading: gatewayLoading } = useAdminRevenueByGateway()

  return (
    <AdminLayout>
      <AdminPageHeader title="Analytics" subtitle="Platform performance and insights — computed live from real data" />

      <div className="flex gap-1 bg-[#111118] border border-[#24242f] rounded-xl p-1 mb-6 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-[#e8001d] text-white' : 'text-[#8b8b9a] hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'Overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dashLoading || !stats.data ? Array.from({ length: 4 }).map((_, i) => <AdminSkeleton key={i} className="h-24" />) : <>
              <StatCard label="Total Users" value={stats.data.users.total.toLocaleString()} sub={`+${stats.data.users.week} this week`} color="blue" icon="👥" />
              <StatCard label="Monthly Revenue" value={`₹${(stats.data.revenue.month / 100).toLocaleString()}`} color="green" icon="💰" />
              <StatCard label="Active VIP" value={stats.data.vip.active} color="yellow" icon="👑" />
              <StatCard label="Published Series" value={stats.data.series.published} color="red" icon="🎬" />
            </>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <AdminCard>
              <SectionHeader title="Revenue — Last 30 Days" />
              {chart.isLoading ? <AdminSkeleton className="h-20 w-full" /> : <BarChart data={(chart.data || []).map(d => d.revenue)} color="#e8001d" />}
              <div className="flex justify-between text-[#3a3a48] text-[10px] mt-1"><span>30 days ago</span><span>Today</span></div>
            </AdminCard>
            <AdminCard>
              <SectionHeader title="New Users — Last 30 Days" />
              {chart.isLoading ? <AdminSkeleton className="h-20 w-full" /> : <BarChart data={(chart.data || []).map(d => d.users)} color="#3b82f6" />}
              <div className="flex justify-between text-[#3a3a48] text-[10px] mt-1"><span>30 days ago</span><span>Today</span></div>
            </AdminCard>
          </div>

          <AdminCard>
            <SectionHeader title="Genre Performance" />
            {genreLoading ? <AdminSkeleton className="h-24 w-full" /> : genreData.length === 0 ? (
              <p className="text-[#5a5a68] text-sm py-4 text-center">No views recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {genreData.map((g: any, i: number) => (
                  <div key={g.genre} className="flex items-center gap-3">
                    <span className="text-[#e8001d] font-black text-sm w-5">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1"><span className="text-[#a0a0b0]">{g.genre}</span><span className="text-white font-bold">{g.views.toLocaleString()} views</span></div>
                      <div className="h-1.5 bg-[#24242f] rounded-full overflow-hidden"><div className="h-full bg-[#e8001d] rounded-full" style={{ width: `${g.percent}%` }} /></div>
                    </div>
                    <span className="text-[#5a5a68] text-xs w-8 text-right">{g.percent}%</span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </>
      )}

      {/* CONTENT */}
      {tab === 'Content' && (
        <AdminCard>
          <SectionHeader title="Top Series by Views" />
          {top.isLoading ? <AdminSkeleton className="h-32 w-full" /> : (top.data || []).length === 0 ? (
            <p className="text-[#5a5a68] text-sm py-4 text-center">No published series yet.</p>
          ) : (
            <div className="space-y-4">
              {(top.data || []).map((s: any, i: number) => (
                <div key={s.title} className="flex items-center gap-4">
                  <span className="text-[#e8001d] font-black text-lg w-8">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                    <div className="h-2 bg-[#24242f] rounded-full overflow-hidden">
                      <div className="h-full bg-[#e8001d] rounded-full" style={{ width: `${Math.min(100, (s.views / Math.max(...(top.data || []).map((t: any) => t.views), 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <p className="text-white font-bold text-sm">{s.views.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* USERS */}
      {tab === 'Users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AdminCard>
            <SectionHeader title="VIP vs Free" />
            {vipLoading || !vipSplit ? <AdminSkeleton className="h-16 w-full" /> : (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-[#a0a0b0]">VIP</span><span className="text-amber-400 font-bold">{vipSplit.vip} ({vipSplit.total ? Math.round((vipSplit.vip / vipSplit.total) * 100) : 0}%)</span></div>
                  <div className="h-2 bg-[#24242f] rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${vipSplit.total ? (vipSplit.vip / vipSplit.total) * 100 : 0}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-[#a0a0b0]">Free</span><span className="text-white font-bold">{vipSplit.free}</span></div>
                  <div className="h-2 bg-[#24242f] rounded-full overflow-hidden"><div className="h-full bg-[#5a5a68] rounded-full" style={{ width: `${vipSplit.total ? (vipSplit.free / vipSplit.total) * 100 : 0}%` }} /></div>
                </div>
              </div>
            )}
          </AdminCard>
          <AdminCard>
            <SectionHeader title="Sign-in Method" />
            {providersLoading ? <AdminSkeleton className="h-16 w-full" /> : providers.length === 0 ? (
              <p className="text-[#5a5a68] text-sm py-4 text-center">No sign-ins yet.</p>
            ) : (
              <div className="space-y-2">
                {providers.map((p: any) => {
                  const total = providers.reduce((s: number, x: any) => s + Number(x.count), 0) || 1
                  const pct = Math.round((Number(p.count) / total) * 100)
                  return (
                    <div key={p.provider} className="flex items-center gap-3 text-sm">
                      <span className="text-[#a0a0b0] flex-1 capitalize">{p.provider}</span>
                      <span className="text-white font-bold w-10 text-right">{p.count}</span>
                      <div className="w-24 h-1.5 bg-[#24242f] rounded-full overflow-hidden"><div className="h-full bg-[#e8001d] rounded-full" style={{ width: `${pct}%` }} /></div>
                    </div>
                  )
                })}
              </div>
            )}
          </AdminCard>
        </div>
      )}

      {/* REVENUE */}
      {tab === 'Revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AdminCard>
            <SectionHeader title="Revenue by Pack" />
            {packLoading ? <AdminSkeleton className="h-24 w-full" /> : revenueByPack.length === 0 ? (
              <p className="text-[#5a5a68] text-sm py-4 text-center">No coin purchases yet — connect a payment gateway to see this fill in.</p>
            ) : (
              <div className="space-y-3">
                {revenueByPack.map((p: any) => (
                  <div key={p.pack}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-[#a0a0b0]">{p.pack}</span><span className="text-emerald-400 font-bold">₹{p.revenue.toLocaleString()}</span></div>
                    <div className="h-1.5 bg-[#24242f] rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.percent}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
          <AdminCard>
            <SectionHeader title="Revenue by Gateway" />
            {gatewayLoading ? <AdminSkeleton className="h-24 w-full" /> : revenueByGateway.length === 0 ? (
              <p className="text-[#5a5a68] text-sm py-4 text-center">No successful transactions yet.</p>
            ) : (
              <div className="space-y-4 mt-2">
                {revenueByGateway.map((g: any) => (
                  <div key={g.gateway}>
                    <div className="flex justify-between text-sm mb-2"><span className="text-white font-semibold capitalize">{g.gateway === 'razorpay' ? '🇮🇳 Razorpay' : '🌍 Stripe'}</span><span className="text-emerald-400 font-bold">₹{g.amount.toLocaleString()}</span></div>
                    <div className="h-3 bg-[#24242f] rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${g.percent}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      )}
    </AdminLayout>
  )
}
