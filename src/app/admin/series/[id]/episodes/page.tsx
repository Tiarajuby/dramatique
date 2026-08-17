'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { AdminPageHeader, AdminTable, TR, TD, AdminBadge, AdminBtn, Toggle, Breadcrumb, AdminCard, TableSkeleton } from '@/components/admin/AdminUI'
import { useAdminSeriesOne, useAdminEpisodes, adminKeys } from '@/hooks/admin/useAdminQueries'
import { adminEpisodeApi } from '@/lib/admin-api'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function EpisodeManagerPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient()
  const { data: series, isLoading: seriesLoading } = useAdminSeriesOne(params.id)
  const { data: episodes = [], isLoading: episodesLoading } = useAdminEpisodes(params.id)

  const refetchEpisodes = () => qc.invalidateQueries({ queryKey: adminKeys.episodes(params.id) })

  const toggleFree = async (id: string, current: boolean) => {
    await adminEpisodeApi.setFree(id, !current)
    refetchEpisodes()
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return
    await adminEpisodeApi.remove(id)
    refetchEpisodes()
    qc.invalidateQueries({ queryKey: adminKeys.seriesOne(params.id) }) // total_episodes count changes
  }

  const statusColor = (status: string) => {
    if (status === 'ready') return 'green'
    if (status === 'processing') return 'yellow'
    return 'gray'
  }

  if (seriesLoading || !series) {
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
      <Breadcrumb items={[
        { label: 'Series', href: '/admin/series' },
        { label: series.title, href: `/admin/series/${params.id}` },
        { label: 'Episodes' },
      ]} />

      <AdminPageHeader
        title={`Episodes — ${series.title}`}
        subtitle={`${episodes.length} episodes · Lock from Ep ${series.lock_from_episode} · ${series.coin_cost_per_episode} coins each`}
        action={
          <div className="flex gap-2">
            <AdminBtn variant="outline"><Upload size={14} /> Bulk Upload</AdminBtn>
            <AdminBtn href={`/admin/series/${params.id}/episodes/new`} variant="primary"><Plus size={14} /> Add Episode</AdminBtn>
          </div>
        }
      />

      {/* QUICK STATS */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: episodes.length, color: 'text-white' },
          { label: 'Free', value: episodes.filter((e: any) => e.is_free).length, color: 'text-green-400' },
          { label: 'Paid', value: episodes.filter((e: any) => !e.is_free).length, color: 'text-[#e8001d]' },
          { label: 'Ready', value: episodes.filter((e: any) => e.status === 'ready').length, color: 'text-blue-400' },
        ].map(s => (
          <AdminCard key={s.label} className="text-center py-3">
            <p className={`font-black text-xl ${s.color}`}>{s.value}</p>
            <p className="text-[#5a5a68] text-xs">{s.label}</p>
          </AdminCard>
        ))}
      </div>

      {episodesLoading ? (
        <TableSkeleton rows={4} cols={9} />
      ) : episodes.length === 0 ? (
        <div className="text-center py-16 bg-[#15151d] border border-[#24242f] rounded-xl text-[#5a5a68]">
          No episodes yet. <AdminBtn href={`/admin/series/${params.id}/episodes/new`} variant="ghost" size="sm">Add the first one</AdminBtn>
        </div>
      ) : (
      <AdminTable headers={['#', 'Title', 'Duration', 'Free', 'Coin Cost', 'Video', 'Status', 'Views', 'Actions']}>
        {episodes.map((ep: any) => (
          <TR key={ep.id}>
            <TD><span className="text-[#e8001d] font-black">{ep.number}</span></TD>
            <TD><span className="text-white font-medium">{ep.title}</span></TD>
            <TD>{formatDuration(ep.duration_seconds)}</TD>
            <TD><Toggle on={ep.is_free} onToggle={() => toggleFree(ep.id, ep.is_free)} /></TD>
            <TD>{ep.is_free ? <span className="text-green-400 text-xs font-bold">FREE</span> : <span className="text-[#c2c2ce] text-xs">{ep.coin_cost ?? series.coin_cost_per_episode} coins</span>}</TD>
            <TD>
              {ep.video_url
                ? <span className="text-green-400 text-xs">✓ Uploaded</span>
                : <span className="text-[#5a5a68] text-xs">Not uploaded</span>
              }
            </TD>
            <TD><AdminBadge label={ep.status} color={statusColor(ep.status) as any} /></TD>
            <TD>{ep.views > 0 ? `${(ep.views / 1000).toFixed(0)}K` : '—'}</TD>
            <TD>
              <div className="flex items-center gap-1">
                <Link href={`/admin/series/${params.id}/episodes/${ep.id}`} className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-white">
                  <Edit size={13} />
                </Link>
                <Link href={`/admin/series/${params.id}/episodes/${ep.id}`} className="p-1.5 hover:bg-[#24242f] rounded-lg transition-colors text-[#8b8b9a] hover:text-white">
                  <Upload size={13} />
                </Link>
                <button onClick={() => handleDelete(ep.id, ep.title)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-[#8b8b9a] hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            </TD>
          </TR>
        ))}
      </AdminTable>
      )}
    </AdminLayout>
  )
}
