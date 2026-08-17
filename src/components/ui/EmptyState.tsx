import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({ icon = '🎭', title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-brand-subtle text-sm leading-relaxed max-w-xs mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary px-8 py-3">{actionLabel}</Link>
      )}
    </div>
  )
}
