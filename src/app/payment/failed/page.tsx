import Link from 'next/link'

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">❌</span>
        </div>
        <h1 className="text-white font-bold text-2xl mb-2">Payment Failed</h1>
        <p className="text-brand-subtle text-sm mb-6 leading-relaxed">
          Your payment could not be processed. No money was charged. Please try again.
        </p>
        <div className="bg-brand-card border border-red-500/20 rounded-xl p-4 mb-6 text-left">
          <p className="text-brand-subtle text-xs mb-1">Possible reasons:</p>
          <ul className="text-brand-text text-xs space-y-1">
            <li>· Insufficient balance</li>
            <li>· Card declined by bank</li>
            <li>· Network timeout</li>
            <li>· UPI app issue</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/coins" className="btn-primary py-3 text-center">Try Again</Link>
          <Link href="/help" className="btn-outline py-3 text-center">Contact Support</Link>
        </div>
      </div>
    </main>
  )
}
