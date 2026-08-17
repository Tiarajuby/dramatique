'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminCard, FormField, Input, Textarea, Select, AdminBtn, SectionHeader } from '@/components/admin/AdminUI'
import { adminNotificationApi } from '@/lib/admin-api'
import { Send, Bell, Loader2 } from 'lucide-react'

export default function NotificationsPage() {
  const [form, setForm] = useState({ title: '', body: '', target: 'all', deep_link: '' })
  const [reach, setReach] = useState(0)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState<any[]>([])
  const [recentLoading, setRecentLoading] = useState(true)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const loadRecent = () => {
    setRecentLoading(true)
    adminNotificationApi.list().then(setRecent).finally(() => setRecentLoading(false))
  }

  useEffect(() => { loadRecent() }, [])
  useEffect(() => {
    adminNotificationApi.estimateReach(form.target).then(setReach)
  }, [form.target])

  const handleSend = async () => {
    setSending(true)
    setError('')
    try {
      await adminNotificationApi.send({ title: form.title, body: form.body, target_segment: form.target, deep_link: form.deep_link }, reach)
      setSent(true)
      loadRecent()
    } catch (err: any) {
      setError(err.message || 'Could not send notification.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader title="Push Notifications" subtitle="Send notifications to your users" />

      <div className="bg-[#15151d] border border-[#24242f] rounded-xl p-4 mb-5 flex items-start gap-3">
        <span className="text-xl">ℹ️</span>
        <div>
          <p className="text-white font-semibold text-sm">Notifications are saved but not yet pushed to devices</p>
          <p className="text-[#8b8b9a] text-xs mt-1">Sending here creates a real record and reach count. Actual delivery to phones needs a push provider (Firebase Cloud Messaging or OneSignal) connected — flagged for setup.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <SectionHeader title="Compose Notification" />
          {sent ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-white font-bold text-lg mb-1">Notification Saved!</p>
              <p className="text-[#8b8b9a] text-sm mb-4">Recorded for {reach.toLocaleString()} users</p>
              <AdminBtn variant="outline" onClick={() => { setSent(false); setForm({ title: '', body: '', target: 'all', deep_link: '' }) }}>
                Send Another
              </AdminBtn>
            </div>
          ) : (
            <div className="space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-red-400 text-xs">{error}</div>}
              <FormField label="Title" required>
                <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. New Episode Alert" />
              </FormField>
              <FormField label="Message" required>
                <Textarea value={form.body} onChange={e => set('body', e.target.value)} placeholder="Short notification message..." rows={3} />
              </FormField>
              <FormField label="Target Audience" required>
                <Select value={form.target} onChange={e => set('target', e.target.value)}>
                  <option value="all">All Users ({reach.toLocaleString()})</option>
                  <option value="vip">VIP Users Only</option>
                  <option value="non-vip">Non-VIP Users</option>
                  <option value="inactive">Inactive 7+ Days</option>
                </Select>
                <p className="text-[#5a5a68] text-xs mt-1">Reaches {reach.toLocaleString()} user{reach === 1 ? '' : 's'}</p>
              </FormField>
              <FormField label="Deep Link URL" hint="Where to go when notification is tapped">
                <Input value={form.deep_link} onChange={e => set('deep_link', e.target.value)} placeholder="/series/forbidden-ceo" />
              </FormField>
              <button
                onClick={handleSend}
                disabled={!form.title || !form.body || sending}
                className="w-full bg-[#e8001d] hover:bg-[#c8001a] disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          )}
        </AdminCard>

        <div>
          <SectionHeader title="Recent Notifications" />
          {recentLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-[#15151d] border border-[#24242f] rounded-xl animate-pulse" />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12 bg-[#15151d] border border-[#24242f] rounded-xl text-[#5a5a68] text-sm">No notifications sent yet.</div>
          ) : (
            <div className="space-y-3">
              {recent.map((n, i) => (
                <AdminCard key={i}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e8001d]/15 flex items-center justify-center flex-shrink-0">
                      <Bell size={14} className="text-[#e8001d]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{n.title}</p>
                      <p className="text-[#8b8b9a] text-xs mt-0.5 line-clamp-1">{n.body}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[#5a5a68]">
                        <span>👥 {n.target}</span>
                        <span>📨 {n.reach.toLocaleString()} reached</span>
                        <span>🕐 {n.sent}</span>
                      </div>
                    </div>
                  </div>
                </AdminCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
