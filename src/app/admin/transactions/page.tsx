'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminTable, TR, TD, AdminBadge, AdminSearchBar, AdminBtn, StatCard, TableSkeleton } from '@/components/admin/AdminUI'
import { useAdminTransactions } from '@/hooks/admin/useAdminQueries'
import { Download } from 'lucide-react'

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useAdminTransactions({ search })
  const rows = data || []

  // "filter" mixes status (success/failed) and type (purchase/vip) in one dropdown by design
  const filtered = rows.filter(t => filter === 'all' || t.status === filter || t.type === filter)

  const totalRevenue = rows.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount_inr, 0)
  const razorpayRevenue = rows.filter(t => t.status === 'success' && t.gateway === 'razorpay').reduce((sum, t) => sum + t.amount_inr, 0)
  const stripeRevenue = rows.filter(t => t.status === 'success' && t.gateway === 'stripe').reduce((sum, t) => sum + t.amount_inr, 0)
  const failedCount = rows.filter(t => t.status === 'failed').length

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Transactions"
        subtitle="All payment records"
        action={<AdminBtn variant="outline"><Download size={14} /> Export CSV</AdminBtn>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="green" icon="💰" />
        <StatCard label="Razorpay" value={`₹${razorpayRevenue.toLocaleString()}`} color="blue" icon="🇮🇳" />
        <StatCard label="Stripe" value={`₹${stripeRevenue.toLocaleString()}`} color="purple" icon="🌍" />
        <StatCard label="Failed" value={failedCount} color="red" icon="❌" />
      </div>

      <AdminSearchBar placeholder="Search by user or transaction ID..." value={search} onChange={setSearch}>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-[#15151d] border border-[#24242f] rounded-xl px-3 py-2.5 text-[#c2c2ce] text-sm outline-none">
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="purchase">Coin Purchase</option>
          <option value="vip">VIP</option>
        </select>
      </AdminSearchBar>

      {isLoading ? (
        <TableSkeleton rows={5} cols={8} />
      ) : (
      <AdminTable headers={['TX ID', 'User', 'Description', 'Amount', 'Coins', 'Gateway', 'Status', 'Date']}>
        {filtered.map(tx => (
          <TR key={tx.id}>
            <TD><span className="text-[#8b8b9a] font-mono text-xs">{tx.id}</span></TD>
            <TD><span className="text-white font-medium text-sm">{tx.user_name}</span></TD>
            <TD><span className="text-[#c2c2ce] text-xs">{tx.desc}</span></TD>
            <TD><span className="text-green-400 font-bold">₹{tx.amount_inr.toLocaleString()}</span></TD>
            <TD>{tx.coins > 0 ? <span className="text-yellow-400 text-xs">+{tx.coins} 🪙</span> : '—'}</TD>
            <TD>
              <span className={`text-xs font-semibold ${tx.gateway === 'razorpay' ? 'text-blue-400' : 'text-purple-400'}`}>
                {tx.gateway === 'razorpay' ? '🇮🇳 Razorpay' : '🌍 Stripe'}
              </span>
            </TD>
            <TD><AdminBadge label={tx.status} color={tx.status === 'success' ? 'green' : 'red'} /></TD>
            <TD><span className="text-[#5a5a68] text-xs">{tx.date}</span></TD>
          </TR>
        ))}
      </AdminTable>
      )}
    </AdminLayout>
  )
}
