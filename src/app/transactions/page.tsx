import { Receipt } from 'lucide-react'

const MOCK_TXN = [
  { id: 'TXN001', type: 'purchase', desc: '100 Coins Pack', amount: '₹285', coins: '+100', date: '15 Aug 2026', status: 'success' },
  { id: 'TXN002', type: 'unlock',   desc: 'Episode 8 — Forbidden CEO', amount: '', coins: '-5', date: '14 Aug 2026', status: 'success' },
  { id: 'TXN003', type: 'reward',   desc: 'Daily Check-in Reward', amount: '', coins: '+5', date: '14 Aug 2026', status: 'success' },
  { id: 'TXN004', type: 'purchase', desc: '30 Coins Pack', amount: '₹89', coins: '+30', date: '13 Aug 2026', status: 'success' },
  { id: 'TXN005', type: 'referral', desc: 'Referral Bonus — Friend joined', amount: '', coins: '+30', date: '12 Aug 2026', status: 'success' },
]

const TYPE_ICON: Record<string, string> = { purchase: '💳', unlock: '🔓', reward: '🎁', referral: '👥' }

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Receipt size={24} className="text-brand-red" />
          <h1 className="text-white font-bold text-3xl">Transaction History</h1>
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_TXN.map(txn => (
            <div key={txn.id} className="flex items-center gap-4 bg-brand-card border border-brand-border rounded-xl px-4 py-3.5 hover:border-brand-muted transition-colors">
              <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-xl flex-shrink-0">
                {TYPE_ICON[txn.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{txn.desc}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-brand-subtle text-xs">{txn.date}</p>
                  <span className="text-brand-border">·</span>
                  <p className="text-brand-subtle text-xs capitalize">{txn.type}</p>
                  {txn.id && <span className="text-brand-muted text-[10px]">{txn.id}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-black text-sm ${txn.coins.startsWith('+') ? 'text-green-400' : 'text-brand-red'}`}>
                  {txn.coins} 🪙
                </p>
                {txn.amount && <p className="text-brand-subtle text-xs mt-0.5">{txn.amount}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
