'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, FormField, Input, Select, Textarea, Toggle, AdminBtn, AdminCard, Breadcrumb } from '@/components/admin/AdminUI'
import { useAdminCategories, useAdminSubcategories } from '@/hooks/admin/useAdminQueries'
import { adminSeriesApi } from '@/lib/admin-api'
import { Save, Loader2 } from 'lucide-react'

export default function AddSeriesPage() {
  const router = useRouter()
  const { data: categories = [] } = useAdminCategories()

  const [form, setForm] = useState({
    title: '', slug: '', synopsis: '', language: 'English',
    thumbnail_url: '', hero_url: '', lock_from_episode: 3,
    coin_cost_per_episode: 5, primary_category: '',
    subcategories: [] as string[], tags: '',
    is_featured: false, status: 'draft',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }))
  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const selectedCategoryId = categories.find((c: any) => c.name === form.primary_category)?.id
  const { data: filteredSubs = [] } = useAdminSubcategories(selectedCategoryId)

  const toggleSub = (name: string) => {
    set('subcategories', form.subcategories.includes(name)
      ? form.subcategories.filter(s => s !== name)
      : [...form.subcategories, name]
    )
  }

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.primary_category) {
      setError('Title, slug, and primary category are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const created = await adminSeriesApi.create(form)
      router.push(`/admin/series/${created.id}/episodes`)
    } catch (err: any) {
      setError(err.message || 'Could not save series. Try again.')
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <Breadcrumb items={[{ label: 'Series', href: '/admin/series' }, { label: 'Add New Series' }]} />
      <AdminPageHeader
        title="Add New Series"
        action={
          <AdminBtn variant="primary" onClick={handleSave}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save Series'}
          </AdminBtn>
        }
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — Main Fields */}
        <div className="lg:col-span-2 space-y-5">
          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Basic Information</h3>
            <div className="space-y-4">
              <FormField label="Title" required>
                <Input value={form.title} onChange={e => { set('title', e.target.value); set('slug', autoSlug(e.target.value)) }} placeholder="e.g. Forbidden CEO" />
              </FormField>
              <FormField label="Slug" required hint="Auto-generated from title. Used in URL: /series/[slug]">
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="forbidden-ceo" />
              </FormField>
              <FormField label="Synopsis" required>
                <Textarea value={form.synopsis} onChange={e => set('synopsis', e.target.value)} placeholder="2-3 line hook that makes viewers want to watch..." rows={3} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Language" required>
                  <Select value={form.language} onChange={e => set('language', e.target.value)}>
                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Spanish', 'Portuguese', 'French', 'German', 'Japanese', 'Korean', 'Arabic', 'Bahasa'].map(l => (
                      <option key={l}>{l}</option>
                    ))}
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
            <h3 className="text-white font-bold text-sm mb-4">Categories & Tags</h3>
            <div className="space-y-4">
              <FormField label="Primary Category" required>
                <Select value={form.primary_category} onChange={e => { set('primary_category', e.target.value); set('subcategories', []) }}>
                  <option value="">Select category...</option>
                  {categories.map((c: any) => <option key={c.id}>{c.name}</option>)}
                </Select>
              </FormField>

              {filteredSubs.length > 0 && (
                <FormField label="Subcategories" hint="Select all that apply — multiple allowed">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {filteredSubs.map((sub: any) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => toggleSub(sub.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          form.subcategories.includes(sub.name)
                            ? 'bg-[#e8001d]/15 border-[#e8001d]/50 text-[#e8001d]'
                            : 'border-[#24242f] text-[#8b8b9a] hover:border-[#5a5a68] hover:text-white'
                        }`}
                      >
                        {sub.icon} {sub.name}
                        {form.subcategories.includes(sub.name) && <span className="text-[#e8001d]">✓</span>}
                      </button>
                    ))}
                  </div>
                </FormField>
              )}

              <FormField label="Tags" hint="Comma separated — e.g. billionaire, fake-marriage, office">
                <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="billionaire, CEO, romance, contract" />
              </FormField>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Media</h3>
            <div className="flex items-start gap-2.5 bg-[#e8001d]/8 border border-[#e8001d]/20 rounded-lg px-3 py-2.5 mb-4">
              <span className="text-sm">🎬</span>
              <p className="text-[#c2c2ce] text-xs leading-relaxed">
                Videos are uploaded per <strong className="text-white">episode</strong>, not here. Save this series first, then add episodes and upload each video.
              </p>
            </div>
            <div className="space-y-4">
              <FormField label="Thumbnail URL" hint="Portrait 2:3 ratio — used in series cards">
                <Input value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} placeholder="https://..." />
              </FormField>
              <FormField label="Hero Image URL" hint="Landscape 16:9 — used in hero banner">
                <Input value={form.hero_url} onChange={e => set('hero_url', e.target.value)} placeholder="https://..." />
              </FormField>
            </div>
          </AdminCard>
        </div>

        {/* RIGHT — Settings */}
        <div className="space-y-5">
          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Paywall Settings</h3>
            <div className="space-y-4">
              <FormField label="Lock From Episode" required hint="Episodes before this are free">
                <Input type="number" min={1} value={form.lock_from_episode} onChange={e => set('lock_from_episode', Number(e.target.value))} />
              </FormField>
              <FormField label="Coin Cost Per Episode" required hint="Coins to unlock each paid episode">
                <Input type="number" min={1} value={form.coin_cost_per_episode} onChange={e => set('coin_cost_per_episode', Number(e.target.value))} />
              </FormField>
              <div className="bg-[#0a0a0f] rounded-xl p-3 text-xs text-[#8b8b9a]">
                <p>Episodes 1–{form.lock_from_episode - 1} → <span className="text-green-400">FREE</span></p>
                <p>Episode {form.lock_from_episode}+ → <span className="text-[#e8001d]">{form.coin_cost_per_episode} coins each</span></p>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-4">Display Options</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Featured in Hero</p>
                <p className="text-[#5a5a68] text-xs">Show in home page banner</p>
              </div>
              <Toggle on={form.is_featured} onToggle={() => set('is_featured', !form.is_featured)} />
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-white font-bold text-sm mb-3">Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[#8b8b9a]">Title</span><span className="text-white font-medium">{form.title || '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#8b8b9a]">Category</span><span className="text-white">{form.primary_category || '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#8b8b9a]">Subcategories</span><span className="text-white">{form.subcategories.length || 0} selected</span></div>
              <div className="flex justify-between"><span className="text-[#8b8b9a]">Lock Point</span><span className="text-white">Ep {form.lock_from_episode}</span></div>
              <div className="flex justify-between"><span className="text-[#8b8b9a]">Coin Cost</span><span className="text-white">{form.coin_cost_per_episode} coins/ep</span></div>
              <div className="flex justify-between"><span className="text-[#8b8b9a]">Status</span><span className={form.status === 'published' ? 'text-green-400' : 'text-yellow-400'}>{form.status}</span></div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full bg-[#e8001d] hover:bg-[#c8001a] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl mt-4 text-sm transition-colors">
              {saving ? 'Saving...' : 'Save Series'}
            </button>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  )
}
