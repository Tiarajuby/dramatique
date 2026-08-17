import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-white font-bold text-2xl mb-2">Payment Successful!</h1>
        <p className="text-brand-subtle text-sm mb-2">Your coins have been credited to your account.</p>
        <div className="bg-brand-card border border-green-500/30 rounded-xl p-4 mb-6 inline-flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <div className="text-left">
            <p className="text-white font-black text-xl">+100 Coins</p>
            <p className="text-brand-subtle text-xs">Added to your balance</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/" className="btn-primary py-3 text-center">Start Watching</Link>
          <Link href="/transactions" className="btn-outline py-3 text-center">View Receipt</Link>
        </div>
      </div>
    </main>
  )
}
