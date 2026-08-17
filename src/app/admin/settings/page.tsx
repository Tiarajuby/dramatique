'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminCard, SectionHeader, FormField, Input, Toggle, AdminBtn } from '@/components/admin/AdminUI'
import { adminSettingsApi } from '@/lib/admin-api'
import { Save, Loader2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminSettingsApi.get().then(setSettings).catch(err => setError(err.message)).finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: any) => setSettings((p: any) => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await adminSettingsApi.update(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: any) {
      setError(err.message || 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#e8001d] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="App Settings"
        action={
          <AdminBtn variant="primary" onClick={handleSave}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : saved ? 'Saved! ✓' : 'Save Settings'}
          </AdminBtn>
        }
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* GENERAL */}
        <AdminCard>
          <SectionHeader title="General" />
          <div className="space-y-4">
            <FormField label="App Name"><Input value={settings.app_name} onChange={e => set('app_name', e.target.value)} /></FormField>
            <FormField label="Tagline"><Input value={settings.tagline} onChange={e => set('tagline', e.target.value)} /></FormField>
            <FormField label="Support Email"><Input value={settings.support_email} onChange={e => set('support_email', e.target.value)} /></FormField>
            <div className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-xl border border-red-500/20">
              <div>
                <p className="text-white font-semibold text-sm">Maintenance Mode</p>
                <p className="text-[#8b8b9a] text-xs">Shows maintenance page to all users</p>
              </div>
              <Toggle on={settings.maintenance_mode} onToggle={() => set('maintenance_mode', !settings.maintenance_mode)} />
            </div>
          </div>
        </AdminCard>

        {/* PAYWALL SETTINGS */}
        <AdminCard>
          <SectionHeader title="Paywall & Unlock Settings" />
          <div className="space-y-4">
            <FormField label="Free Episodes (Global Default)" hint="Episodes available free before paywall">
              <Input type="number" min={1} max={10} value={settings.free_episodes} onChange={e => set('free_episodes', Number(e.target.value))} />
            </FormField>
            <FormField label="Ads to Unlock Episode" hint="Number of ads user must watch">
              <Input type="number" min={1} max={5} value={settings.ad_unlock_count} onChange={e => set('ad_unlock_count', Number(e.target.value))} />
            </FormField>
            <FormField label="Daily Ad Unlock Limit" hint="Max episodes unlockable via ads per day">
              <Input type="number" min={1} max={10} value={settings.daily_ad_limit} onChange={e => set('daily_ad_limit', Number(e.target.value))} />
            </FormField>
          </div>
        </AdminCard>

        {/* COIN REWARDS */}
        <AdminCard>
          <SectionHeader title="Coin Reward Settings" />
          <div className="space-y-4">
            <FormField label="Daily Check-in Reward" hint="Coins earned per daily visit">
              <Input type="number" min={1} value={settings.daily_checkin_coins} onChange={e => set('daily_checkin_coins', Number(e.target.value))} />
            </FormField>
            <FormField label="Referrer Reward" hint="Coins for user who referred">
              <Input type="number" min={1} value={settings.referrer_coins} onChange={e => set('referrer_coins', Number(e.target.value))} />
            </FormField>
            <FormField label="Referred User Reward" hint="Coins for newly referred user">
              <Input type="number" min={1} value={settings.referred_coins} onChange={e => set('referred_coins', Number(e.target.value))} />
            </FormField>
            <FormField label="Welcome Bonus" hint="Coins on first sign up">
              <Input type="number" min={0} value={settings.welcome_bonus} onChange={e => set('welcome_bonus', Number(e.target.value))} />
            </FormField>
          </div>
        </AdminCard>

        {/* SOCIAL LINKS */}
        <AdminCard>
          <SectionHeader title="Social Media Links" />
          <div className="space-y-4">
            <FormField label="Instagram"><Input value={settings.instagram} onChange={e => set('instagram', e.target.value)} /></FormField>
            <FormField label="TikTok"><Input value={settings.tiktok} onChange={e => set('tiktok', e.target.value)} /></FormField>
            <FormField label="YouTube"><Input value={settings.youtube} onChange={e => set('youtube', e.target.value)} /></FormField>
          </div>
        </AdminCard>

      </div>
    </AdminLayout>
  )
}
