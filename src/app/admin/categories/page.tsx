'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminBadge, AdminBtn, FormField, Input, Textarea, Select } from '@/components/admin/AdminUI'
import { useAdminCategories, useAdminSubcategories, adminKeys } from '@/hooks/admin/useAdminQueries'
import { adminCategoryApi } from '@/lib/admin-api'
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, GripVertical, Loader2 } from 'lucide-react'

const autoSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function SubcategoryRow({ sub, onEdit, onDelete }: { sub: any; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#20202b] transition-colors border-b border-[#24242f] last:border-0">
      <GripVertical size={14} className="text-[#3a3a48] cursor-grab" />
      <span className="text-base">{sub.icon}</span>
      <div className="flex-1">
        <p className="text-[#c2c2ce] text-sm">{sub.name}</p>
        <p className="text-[#3a3a48] text-xs">/{sub.slug} · {sub.series_count} series</p>
      </div>
      <AdminBadge label={sub.is_active ? 'Active' : 'Hidden'} color={sub.is_active ? 'green' : 'gray'} />
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-1.5 hover:bg-[#24242f] rounded-lg text-[#8b8b9a] hover:text-white transition-colors"><Edit size={12} /></button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#8b8b9a] hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
      </div>
    </div>
  )
}

function CategoryRow({ cat, subs, onEditCategory, onDeleteCategory, onAddSub, onEditSub, onDeleteSub }: {
  cat: any; subs: any[]
  onEditCategory: () => void; onDeleteCategory: () => void; onAddSub: () => void
  onEditSub: (sub: any) => void; onDeleteSub: (sub: any) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="bg-[#15151d] border border-[#24242f] rounded-xl overflow-hidden mb-3">
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a24] transition-colors">
        <GripVertical size={16} className="text-[#3a3a48] cursor-grab" />
        <button onClick={() => setExpanded(!expanded)} className="text-[#8b8b9a] hover:text-white transition-colors">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: (cat.color || '#e8001d') + '20' }}>
          {cat.icon}
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{cat.name}</p>
          <p className="text-[#5a5a68] text-xs">/{cat.slug} · {cat.series_count} series · {subs.length} subcategories</p>
        </div>
        <AdminBadge label={cat.is_active ? 'Active' : 'Hidden'} color={cat.is_active ? 'green' : 'gray'} />
        <div className="flex gap-1">
          <AdminBtn variant="ghost" size="sm" onClick={onEditCategory}><Edit size={12} /></AdminBtn>
          <AdminBtn variant="ghost" size="sm" onClick={onAddSub}><Plus size={12} /> Sub</AdminBtn>
          <AdminBtn variant="danger" size="sm" onClick={onDeleteCategory}><Trash2 size={12} /></AdminBtn>
        </div>
      </div>

      {expanded && subs.length > 0 && (
        <div className="ml-8 border-t border-[#24242f]">
          {subs.map(sub => <SubcategoryRow key={sub.id} sub={sub} onEdit={() => onEditSub(sub)} onDelete={() => onDeleteSub(sub)} />)}
        </div>
      )}
    </div>
  )
}

type ModalState = { mode: 'add' | 'edit'; type: 'category' | 'subcategory'; id?: string } | null

export default function CategoryManagerPage() {
  const qc = useQueryClient()
  const { data: categories = [] } = useAdminCategories()
  const { data: allSubs = [] } = useAdminSubcategories()

  const [modal, setModal] = useState<ModalState>(null)
  const [form, setForm] = useState<any>({ name: '', slug: '', icon: '', color: '#e8001d', description: '', category_id: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refetchAll = () => {
    qc.invalidateQueries({ queryKey: adminKeys.categories })
    qc.invalidateQueries({ queryKey: ['admin', 'subcategories'] })
  }

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const openAddCategory = () => { setForm({ name: '', slug: '', icon: '', color: '#e8001d', description: '' }); setModal({ mode: 'add', type: 'category' }); setError('') }
  const openEditCategory = (cat: any) => { setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, color: cat.color, description: cat.description || '' }); setModal({ mode: 'edit', type: 'category', id: cat.id }); setError('') }
  const openAddSub = (categoryId: string) => { setForm({ name: '', slug: '', icon: '', description: '', category_id: categoryId }); setModal({ mode: 'add', type: 'subcategory' }); setError('') }
  const openEditSub = (sub: any) => { setForm({ name: sub.name, slug: sub.slug, icon: sub.icon, description: sub.description || '', category_id: sub.category_id }); setModal({ mode: 'edit', type: 'subcategory', id: sub.id }); setError('') }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required.'); return }
    if (modal?.type === 'subcategory' && !form.category_id) { setError('Parent category is required.'); return }
    setSaving(true)
    setError('')
    try {
      const slug = form.slug || autoSlug(form.name)
      if (modal?.type === 'category') {
        const payload = { name: form.name, slug, icon: form.icon, color: form.color, description: form.description }
        if (modal.mode === 'add') await adminCategoryApi.createCategory(payload)
        else await adminCategoryApi.updateCategory(modal.id!, payload)
      } else {
        const payload = { name: form.name, slug, icon: form.icon, description: form.description, category_id: form.category_id }
        if (modal?.mode === 'add') await adminCategoryApi.createSubcategory(payload)
        else await adminCategoryApi.updateSubcategory(modal!.id!, payload)
      }
      refetchAll()
      setModal(null)
    } catch (err: any) {
      setError(err.message || 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (cat: any) => {
    if (!confirm(`Delete "${cat.name}"? Series using it will need a new category.`)) return
    try { await adminCategoryApi.removeCategory(cat.id); refetchAll() }
    catch (err: any) { alert(err.message || 'Could not delete category.') }
  }
  const handleDeleteSub = async (sub: any) => {
    if (!confirm(`Delete "${sub.name}"?`)) return
    try { await adminCategoryApi.removeSubcategory(sub.id); refetchAll() }
    catch (err: any) { alert(err.message || 'Could not delete subcategory.') }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Category Manager"
        subtitle={`${categories.length} categories · ${allSubs.length} subcategories`}
        action={
          <div className="flex gap-2">
            <AdminBtn variant="outline" onClick={() => { setForm({ name: '', slug: '', icon: '', description: '', category_id: categories[0]?.id || '' }); setModal({ mode: 'add', type: 'subcategory' }); setError('') }}>
              <Plus size={14} /> Add Subcategory
            </AdminBtn>
            <AdminBtn variant="primary" onClick={openAddCategory}><Plus size={14} /> Add Category</AdminBtn>
          </div>
        }
      />

      <div className="bg-[#15151d] border border-[#24242f] rounded-xl p-4 mb-5 flex items-start gap-3">
        <span className="text-xl">ℹ️</span>
        <div>
          <p className="text-white font-semibold text-sm">How categories work</p>
          <p className="text-[#8b8b9a] text-xs mt-1">Each series has one <strong className="text-white">primary category</strong> and can have multiple <strong className="text-white">subcategories</strong>.</p>
        </div>
      </div>

      <div>
        {categories.map((cat: any) => (
          <CategoryRow
            key={cat.id}
            cat={cat}
            subs={allSubs.filter((s: any) => s.category_id === cat.id)}
            onEditCategory={() => openEditCategory(cat)}
            onDeleteCategory={() => handleDeleteCategory(cat)}
            onAddSub={() => openAddSub(cat.id)}
            onEditSub={openEditSub}
            onDeleteSub={handleDeleteSub}
          />
        ))}
      </div>

      {/* ADD/EDIT MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#15151d] border border-[#24242f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">
                {modal.mode === 'add' ? 'Add' : 'Edit'} {modal.type === 'category' ? 'Category' : 'Subcategory'}
              </h3>
              <button onClick={() => setModal(null)} className="text-[#8b8b9a] hover:text-white">✕</button>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-red-400 text-xs mb-4">{error}</div>}

            <div className="space-y-4">
              {modal.type === 'subcategory' && (
                <FormField label="Parent Category" required>
                  <Select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                    <option value="">Select parent category...</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </FormField>
              )}
              <FormField label="Name" required>
                <Input value={form.name} onChange={e => { set('name', e.target.value); if (!form.slug) set('slug', autoSlug(e.target.value)) }} placeholder={modal.type === 'category' ? 'e.g. Romance' : 'e.g. CEO Romance'} />
              </FormField>
              <FormField label="Slug" hint="Auto-generated from name">
                <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="ceo-romance" />
              </FormField>
              <FormField label="Icon (emoji)">
                <Input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="💼" />
              </FormField>
              {modal.type === 'category' && (
                <FormField label="Color">
                  <Input type="color" value={form.color} onChange={e => set('color', e.target.value)} />
                </FormField>
              )}
              <FormField label="Description">
                <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description..." rows={2} />
              </FormField>
            </div>

            <div className="flex gap-3 mt-6">
              <AdminBtn variant="outline" onClick={() => setModal(null)}>Cancel</AdminBtn>
              <AdminBtn variant="primary" onClick={handleSave}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {saving ? 'Saving...' : modal.mode === 'add' ? `Create ${modal.type === 'category' ? 'Category' : 'Subcategory'}` : 'Save Changes'}
              </AdminBtn>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
