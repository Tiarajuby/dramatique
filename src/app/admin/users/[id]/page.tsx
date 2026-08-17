'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminCard, SectionHeader, AdminBadge, AdminBtn, Breadcrumb, FormField, Input, Select, AdminSkeleton } from '@/components/admin/AdminUI'
import { useAdminUserOne, adminKeys } from '@/hooks/admin/useAdminQueries'
import { adminUserApi } from '@/lib/admin-api'
import { Coins, Crown, Ban, Plus, Minus, Clock, Gift, Loader2 } from 'lucide-react'

const VIP_DURATIONS = [
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '1 Year', days: 365 },
]

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient()
  const { data: user, isLoading, error } = useAdminUserOne(params.id)

  const [ledger, setLedger] = useState<any[]>([])
  const [ledgerLoading, setLedgerLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  const loadActivity = () => {
    setLedgerLoading(true)
    setHistoryLoading(true)
    adminUserApi.getLedger(params.id).then(setLedger).finally(() => setLedgerLoading(false))
    adminUserApi.getWatchHistory(params.id).then(setHistory).finally(() => setHistoryLoading(false))
  }

  useEffect(() => { loadActivity() }, [params.id])

  const [coinModal, setCoinModal] = useState<'credit' | 'deduct' | null>(null)
  const [coinAmount, setCoinAmount] = useState('')
  const [coinReason, setCoinReason] = useState('')
  const [coinSaving, setCoinSaving] = useState(false)
  const [coinError, setCoinError] = useState('')

  const [vipModal, setVipModal] = useState(false)
  const [vipDuration, setVipDuration] = useState(VIP_DURATIONS[0].days)
  const [vipSaving, setVipSaving] = useState(false)

  const [banSaving, setBanSaving] = useState(false)

  const refetchUser = () => qc.invalidateQueries({ queryKey: adminKeys.userOne(params.id) })

  const handleCoinConfirm = async () => {
    const amount = Number(coinAmount)
    if (!amount || amount <= 0) { setCoinError('Enter a valid amount.'); return }
    if (!coinReason.trim()) { setCoinError('A reason is required — this is logged for audit.'); return }
    setCoinSaving(true)
    setCoinError('')
    try {
      if (coinModal === 'credit') await adminUserApi.creditCoins(params.id, amount, coinReason)
      else await adminUserApi.deductCoins(params.id, amount, coinReason)
      refetchUser()
      loadActivity()
      setCoinModal(null)
      setCoinAmount('')
      setCoinReason('')
    } catch (err: any) {
      setCoinError(err.message || 'Could not complete this action.')
    } finally {
      setCoinSaving(false)
    }
  }

  const handleGrantVIP = async () => {
    setVipSaving(true)
    try {
      const until = new Date(Date.now() + vipDuration * 24 * 60 * 60 * 1000).toISOString()
      await adminUserApi.grantVIP(params.id, until)
      refetchUser()
      setVipModal(false)
    } catch (err: any) {
      alert(err.message || 'Could not grant VIP.')
    } finally {
      setVipSaving(false)
    }
  }

  const handleRevokeVIP = async () => {
    if (!confirm('Revoke VIP for this user?')) return
    setVipSaving(true)
    try {
      await adminUserApi.revokeVIP(params.id)
      refetchUser()
    } catch (err: any) {
      alert(err.message || 'Could not revoke VIP.')
    } finally {
      setVipSaving(false)
    }
  }

  const handleToggleBan = async () => {
    if (!user) return
    const banning = user.status !== 'banned'
    if (!confirm(banning ? 'Ban this user? They will lose access immediately.' : 'Unban this user?')) return
    setBanSaving(true)
    try {
      await adminUserApi.setBanned(params.id, banning)
      refetchUser()
    } catch (err: any) {
      alert(err.message || 'Could not update ban status.')
    } finally {
      setBanSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#e8001d] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="text-center py-24 text-[#8b8b9a]">User not found.</div>
      </AdminLayout>
    )
  }

  const isBanned = user.status === 'banned'

  return (
    <AdminLayout>
      <Breadcrumb items={[{ label: 'Users', href: '/admin/users' }, { label: user.display_name }]} />

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#e8001d]/15 flex items-center justify-center text-[#e8001d] text-xl font-bold flex-shrink-0">
            {user.display_name[0]}
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl">{user.display_name}</h1>
            <p className="text-[#8b8b9a] text-sm">{user.phone} · {user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {user.is_vip
            ? <AdminBtn variant="outline" onClick={handleRevokeVIP}>{vipSaving ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />} Revoke VIP</AdminBtn>
            : <AdminBtn variant="outline" onClick={() => setVipModal(true)}><Crown size={14} /> Grant VIP</AdminBtn>}
          <AdminBtn variant="danger" onClick={handleToggleBan}>
            {banSaving ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />} {isBanned ? 'Unban' : 'Ban'}
          </AdminBtn>
        </div>
      </div>

      {/* STAT ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminCard>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[#8b8b9a] text-xs">Coin Balance</p>
            <span className="text-amber-400">🪙</span>
          </div>
          <p className="text-amber-400 font-bold text-2xl">{user.coins}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setCoinModal('credit')} className="flex-1 flex items-center justify-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg py-1.5 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
              <Plus size={12} /> Credit
            </button>
            <button onClick={() => setCoinModal('deduct')} className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg py-1.5 text-xs font-semibold hover:bg-red-500/20 transition-colors">
              <Minus size={12} /> Deduct
            </button>
          </div>
        </AdminCard>
        <AdminCard>
          <p className="text-[#8b8b9a] text-xs mb-1">VIP Status</p>
          {user.is_vip
            ? <><p className="text-amber-400 font-bold text-lg">Active</p><p className="text-[#5a5a68] text-xs mt-1">Until {new Date(user.vip_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></>
            : <p className="text-[#8b8b9a] font-bold text-lg">Free User</p>}
        </AdminCard>
        <AdminCard>
          <p className="text-[#8b8b9a] text-xs mb-1">Total Spent</p>
          <p className="text-emerald-400 font-bold text-2xl">₹{user.total_spent}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-[#8b8b9a] text-xs mb-1">Joined</p>
          <p className="text-white font-bold text-lg">{user.joined}</p>
          <AdminBadge label={user.status} color={isBanned ? 'red' : 'green'} />
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <SectionHeader title="Coin Ledger" />
          {ledgerLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <AdminSkeleton key={i} className="h-10 w-full" />)}</div>
          ) : ledger.length === 0 ? (
            <p className="text-[#5a5a68] text-sm py-6 text-center">No coin activity yet.</p>
          ) : (
            <div className="space-y-1">
              {ledger.map((tx, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-[#24242f] last:border-0">
                  <div className="w-7 h-7 rounded-full bg-[#20202b] flex items-center justify-center flex-shrink-0">
                    {tx.source === 'purchase' ? <Coins size={13} className="text-amber-400" /> : tx.source === 'referral' ? <Gift size={13} className="text-purple-400" /> : tx.source === 'checkin' ? <Clock size={13} className="text-blue-400" /> : <span className="text-xs">🔓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{tx.desc}</p>
                    <p className="text-[#5a5a68] text-[10px]">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount}</span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <SectionHeader title="Watch History" />
          {historyLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <AdminSkeleton key={i} className="h-12 w-full" />)}</div>
          ) : history.length === 0 ? (
            <p className="text-[#5a5a68] text-sm py-6 text-center">No watch activity yet.</p>
          ) : (
            <div className="space-y-1">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#24242f] last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-[#e8001d]/10 flex items-center justify-center text-[#e8001d] text-xs font-bold flex-shrink-0">{h.ep}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{h.series}</p>
                    <p className="text-[#5a5a68] text-xs">Episode {h.ep}</p>
                  </div>
                  <span className="text-[#8b8b9a] text-xs">{h.when}</span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* COIN MODAL */}
      {coinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#15151d] border border-[#24242f] rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">{coinModal === 'credit' ? 'Credit Coins' : 'Deduct Coins'}</h3>
            {coinError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-red-400 text-xs mb-4">{coinError}</div>}
            <div className="space-y-4">
              <FormField label="Amount" required><Input type="number" min={1} value={coinAmount} onChange={e => setCoinAmount(e.target.value)} placeholder="e.g. 50" /></FormField>
              <FormField label="Reason" required hint="Logged for audit"><Input value={coinReason} onChange={e => setCoinReason(e.target.value)} placeholder="e.g. Support compensation" /></FormField>
            </div>
            <div className="flex gap-3 mt-5">
              <AdminBtn variant="outline" onClick={() => { setCoinModal(null); setCoinError('') }}>Cancel</AdminBtn>
              <AdminBtn variant="primary" onClick={handleCoinConfirm}>
                {coinSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                {coinSaving ? 'Saving...' : coinModal === 'credit' ? 'Credit Coins' : 'Deduct Coins'}
              </AdminBtn>
            </div>
          </div>
        </div>
      )}

      {/* VIP GRANT MODAL */}
      {vipModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#15151d] border border-[#24242f] rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">Grant VIP</h3>
            <FormField label="Duration" required>
              <Select value={vipDuration} onChange={e => setVipDuration(Number(e.target.value))}>
                {VIP_DURATIONS.map(d => <option key={d.days} value={d.days}>{d.label}</option>)}
              </Select>
            </FormField>
            <div className="flex gap-3 mt-5">
              <AdminBtn variant="outline" onClick={() => setVipModal(false)}>Cancel</AdminBtn>
              <AdminBtn variant="primary" onClick={handleGrantVIP}>
                {vipSaving ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                {vipSaving ? 'Granting...' : 'Grant VIP'}
              </AdminBtn>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
