import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="font-display text-[120px] text-brand-red/20 leading-none mb-4">404</div>
        <h1 className="text-white font-bold text-2xl mb-2">Page not found</h1>
        <p className="text-brand-subtle text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="btn-primary py-3 text-center">Go Home</Link>
          <Link href="/categories" className="btn-outline py-3 text-center">Browse Series</Link>
        </div>
      </div>
    </main>
  )
}
