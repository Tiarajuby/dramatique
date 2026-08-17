import Link from 'next/link'

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl mb-2">Refund Policy</h1>
          <p className="text-brand-subtle text-sm">Last updated: 15 August 2026</p>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Coin Purchases', icon: '🪙', content: 'Coin purchases are generally non-refundable once coins have been credited to your account. If coins were not credited due to a technical error on our end, please contact support within 7 days and we will investigate and resolve the issue.' },
            { title: 'VIP Subscriptions', icon: '👑', content: 'VIP subscriptions can be cancelled at any time. You will retain VIP access until the end of your current billing period. We do not offer partial refunds for unused subscription time. If you were charged in error, contact us within 48 hours.' },
            { title: 'Failed Payments', icon: '❌', content: 'If your payment failed but you were still charged by your bank, please contact us with your transaction ID. We will investigate and ensure a refund is processed within 5-7 business days.' },
            { title: 'Duplicate Charges', icon: '🔄', content: 'If you were charged twice for the same purchase, please contact support immediately with both transaction IDs. Duplicate charges will be refunded within 3-5 business days.' },
            { title: 'Technical Issues', icon: '🛠️', content: 'If a technical issue prevented you from accessing content you paid for, contact support within 7 days. We will either restore access or provide a coin credit of equivalent value.' },
            { title: 'How to Request a Refund', icon: '📧', content: 'Email support@dramatique.com with your account email, transaction ID, amount, and reason for the refund request. We aim to respond within 24 hours on business days.' },
          ].map(item => (
            <div key={item.title} className="bg-brand-card border border-brand-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.icon}</span>
                <h2 className="text-white font-bold text-base">{item.title}</h2>
              </div>
              <p className="text-brand-subtle text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}

          <div className="bg-gradient-to-r from-brand-red/10 to-brand-dark border border-brand-red/20 rounded-xl p-5 text-center">
            <p className="text-white font-bold mb-2">Need help with a refund?</p>
            <p className="text-brand-subtle text-sm mb-4">Our support team is here to help.</p>
            <Link href="/contact" className="btn-primary px-6 py-2.5 inline-block">Contact Support</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
