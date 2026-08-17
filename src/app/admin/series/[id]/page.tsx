'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, FormField, Input, Select, Textarea, Toggle, AdminBtn, AdminCard, Breadcrumb } from '@/components/admin/AdminUI'
import { useAdminCategories, useAdminSubcategories, useAdminSeriesOne, adminKeys } from '@/hooks/admin/useAdminQueries'
import { adminSeriesApi } from '@/lib/admin-api'
import { Save, Play, Trash2, Loader2 } from 'lucide-react'

export default function EditSeriesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const qc = useQueryClient()
  const { data: existing, isLoading } = useAdminSeriesOne(params.id)
  const { data: categories = [] } = useAdminCategories()

  const [form, setForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill once the real series loads
  useEffect(() => {
    if (existing && !form) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        synopsis: existing.synopsis,
        language: existing.language,
        lock_from_episode: existing.lock_from_episode,
        coin_cost_per_episode: existing.coin_cost_per_episode,
        primary_category: existing.primary_category,
        subcategories: existing.subcategories as string[],
        tags: existing.tags || '',
        is_featured: existing.is_featured,
        status: existing.status,
      })
    }
  }, [existing, form])

  const selectedCategoryId = categories.find((c: any) => c.name === form?.primary_category)?.id
  const { data: filteredSubs = [] } = useAdminSubcategories(selectedCategoryId)

  if (isLoading || !form || !existing) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#e8001d] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const toggleSub = (name: string) => set('subcategories', form.subcategories.includes(name) ? form.subcategories.filter((s: string) => s !== name) : [...form.subcategories, name])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await adminSeriesApi.update(params.id, form)
      qc.invalidateQueries({ queryKey: adminKeys.seriesOne(params.id) })
      qc.invalidateQueries({ queryKey: ['admin', 'series'] })
      router.push('/admin/series')
    } catch (err: any) {
      setError(err.message || 'Could not save changes. Try again.')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${form.title}" and all its episodes? This can't be undone.`)) return
    setDeleting(true)
    try {
      await adminSeriesApi.remove(params.id)
      router.push('/admin/series')
    } catch (err: any) {
      setError(err.message || 'Could not delete series.')
      setDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <Breadcrumb items={[{ label: 'Series', href: '/admin/series' }, { label: form.title }]} />
      <AdminPageHeader
        title={`Edit — ${form.title}`}
        subtitle={`${existing.total_episodes} episodes · ${existing.views > 0 ? (existing.views / 1000000).toFixed(1) + 'M views' : 'unpublished'}`}
        action={
          <div className="flex gap-2">
            <AdminBtn href={`/admin/series/${params.id}/episodes`} variant="outline"><Play size={14} /> Episodes</AdminBtn>
            <AdminBtn variant="primary" onClick={handleSave}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </AdminBtn>
          </div>
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
            <h3 className="text-white font-bold text-sm mb-4">Basic Information</h3>
            <div className="space-y-4">
              <FormField label="Title" required><Input value={form.title} onChange={e => set('title', e.target.value)} /></FormField>
              <FormField label="Slug" required><Input value={form.slug} onChange={e => set('slug', e.target.value)} /></FormField>
              <FormField label="Synopsis" required><Textarea value={form.synopsis} onChange={e => set('synopsis', e.target.value)} rows={3} /></FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Language" required>
                  <Select value={form.language} onChange={e => set('language', e.target.value)}>
                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Spanish'].map(l => <option key={l}>{l}</option>)}
                  </Select>
                </FormField>
                <FormField label="Status" required>
                  <Select value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </FormField>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Categories</h3>
            <div className="space-y-4">
              <FormField label="Primary Category" required>
                <Select value={form.primary_category} onChange={e => { set('primary_category', e.target.value); set('subcategories', []) }}>
                  {categories.map((c: any) => <option key={c.id}>{c.name}</option>)}
                </Select>
              </FormField>
              {filteredSubs.length > 0 && (
                <FormField label="Subcategories" hint="Multiple allowed">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {filteredSubs.map((sub: any) => (
                      <button key={sub.id} type="button" onClick={() => toggleSub(sub.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.subcategories.includes(sub.name) ? 'bg-[#e8001d]/15 border-[#e8001d]/50 text-[#e8001d]' : 'border-[#24242f] text-[#8b8b9a] hover:border-[#5a5a68] hover:text-white'}`}>
                        {sub.icon} {sub.name}{form.subcategories.includes(sub.name) && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </FormField>
              )}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Paywall</h3>
            <div className="space-y-4">
              <FormField label="Lock From Episode" required><Input type="number" min={1} value={form.lock_from_episode} onChange={e => set('lock_from_episode', Number(e.target.value))} /></FormField>
              <FormField label="Coin Cost / Episode" required><Input type="number" min={1} value={form.coin_cost_per_episode} onChange={e => set('coin_cost_per_episode', Number(e.target.value))} /></FormField>
              <div className="bg-[#0a0a0f] rounded-xl p-3 text-xs text-[#8b8b9a]">
                <p>Ep 1–{form.lock_from_episode - 1} → <span className="text-emerald-400">FREE</span></p>
                <p>Ep {form.lock_from_episode}+ → <span className="text-[#e8001d]">{form.coin_cost_per_episode} coins</span></p>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between">
              <div><p className="text-white text-sm font-medium">Featured in Hero</p><p className="text-[#5a5a68] text-xs">Show in home banner</p></div>
              <Toggle on={form.is_featured} onToggle={() => set('is_featured', !form.is_featured)} />
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-3">Danger Zone</h3>
            <button onClick={handleDelete} disabled={deleting}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl py-2.5 text-sm font-semibold hover:bg-red-500/20 disabled:opacity-50 transition-colors">
              <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Series'}
            </button>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  )
}
