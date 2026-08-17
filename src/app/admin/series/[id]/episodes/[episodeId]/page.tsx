'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, FormField, Input, Toggle, AdminBtn, AdminCard, Breadcrumb } from '@/components/admin/AdminUI'
import { useAdminSeriesOne, useAdminEpisodeOne, adminKeys } from '@/hooks/admin/useAdminQueries'
import { adminEpisodeApi } from '@/lib/admin-api'
import { Save, Film, Loader2, Trash2 } from 'lucide-react'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
function parseDuration(text: string): number {
  const parts = text.split(':').map(Number)
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return parts[0] * 60 + parts[1]
  return 60
}

export default function EditEpisodePage({ params }: { params: { id: string; episodeId: string } }) {
  const router = useRouter()
  const qc = useQueryClient()
  const { data: series, isLoading: seriesLoading } = useAdminSeriesOne(params.id)
  const { data: episode, isLoading: episodeLoading } = useAdminEpisodeOne(params.episodeId)

  const [form, setForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (episode && !form) {
      setForm({
        episode_number: episode.episode_number,
        title: episode.title,
        duration: formatDuration(episode.duration_seconds),
        is_free: episode.is_free,
        coin_cost: episode.coin_cost ?? series?.coin_cost_per_episode ?? 5,
        video_id: episode.video_id || '',
        subtitles_url: episode.subtitles_url || '',
      })
    }
  }, [episode, series, form])

  if (seriesLoading || episodeLoading || !form || !series || !episode) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#e8001d] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await adminEpisodeApi.update(params.episodeId, {
        episode_number: form.episode_number,
        title: form.title,
        duration_seconds: parseDuration(form.duration),
        is_free: form.is_free,
        coin_cost: form.is_free ? null : form.coin_cost,
        video_id: form.video_id || null,
        subtitles_url: form.subtitles_url || null,
        status: form.video_id ? 'ready' : 'pending',
      })
      qc.invalidateQueries({ queryKey: adminKeys.episodes(params.id) })
      qc.invalidateQueries({ queryKey: ['admin', 'episode', params.episodeId] })
      router.push(`/admin/series/${params.id}/episodes`)
    } catch (err: any) {
      setError(err.message || 'Could not save changes. Try again.')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${form.title}"? This can't be undone.`)) return
    setDeleting(true)
    try {
      await adminEpisodeApi.remove(params.episodeId)
      qc.invalidateQueries({ queryKey: adminKeys.episodes(params.id) })
      qc.invalidateQueries({ queryKey: adminKeys.seriesOne(params.id) })
      router.push(`/admin/series/${params.id}/episodes`)
    } catch (err: any) {
      setError(err.message || 'Could not delete episode.')
      setDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <Breadcrumb items={[
        { label: 'Series', href: '/admin/series' },
        { label: series.title, href: `/admin/series/${params.id}` },
        { label: 'Episodes', href: `/admin/series/${params.id}/episodes` },
        { label: form.title || `Episode ${form.episode_number}` },
      ]} />
      <AdminPageHeader
        title={`Edit — ${form.title || `Episode ${form.episode_number}`}`}
        subtitle={series.title}
        action={
          <AdminBtn variant="primary" onClick={handleSave}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </AdminBtn>
        }
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Episode Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Episode Number" required><Input type="number" value={form.episode_number} onChange={e => set('episode_number', Number(e.target.value))} /></FormField>
                <FormField label="Duration" hint="e.g. 1:05"><Input value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="1:05" /></FormField>
              </div>
              <FormField label="Title" required><Input value={form.title} onChange={e => set('title', e.target.value)} /></FormField>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Video</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-[#0a0a0f] border border-[#24242f] rounded-xl p-4">
                <Film size={20} className="text-[#5a5a68] flex-shrink-0" />
                <p className="text-xs text-[#8b8b9a]">
                  {episode.status === 'ready' ? <span className="text-emerald-400">✓ Video linked and ready</span> : <span className="text-amber-400">Video not yet linked</span>}
                </p>
              </div>
              <FormField label="Cloudflare Video ID"><Input value={form.video_id} onChange={e => set('video_id', e.target.value)} placeholder="e.g. a1b2c3d4..." /></FormField>
              <FormField label="Subtitles URL" hint="Optional — WebVTT file"><Input value={form.subtitles_url} onChange={e => set('subtitles_url', e.target.value)} placeholder="https://..." /></FormField>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Access</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="text-white text-sm font-medium">Free Episode</p><p className="text-[#5a5a68] text-xs">Overrides series lock</p></div>
                <Toggle on={form.is_free} onToggle={() => set('is_free', !form.is_free)} />
              </div>
              {!form.is_free && (
                <FormField label="Coin Cost" hint={`Series default: ${series.coin_cost_per_episode}`}><Input type="number" value={form.coin_cost} onChange={e => set('coin_cost', Number(e.target.value))} /></FormField>
              )}
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-3">Danger Zone</h3>
            <button onClick={handleDelete} disabled={deleting}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl py-2.5 text-sm font-semibold hover:bg-red-500/20 disabled:opacity-50 transition-colors">
              <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Episode'}
            </button>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  )
}
