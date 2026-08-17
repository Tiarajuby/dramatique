import Link from 'next/link'

export default function ReferralLandingPage({ params }: { params: { code: string } }) {
  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-sm">

        {/* LOGO */}
        <div className="bg-brand-red px-3 py-1.5 rounded-xl inline-block mb-6">
          <span className="font-display text-white font-black text-3xl tracking-tight leading-none block">DRAMA</span>
          <span className="font-display text-white font-black text-3xl tracking-tight leading-none block -mt-1">TIQUE</span>
        </div>

        {/* GIFT */}
        <div className="text-6xl mb-4">🎁</div>
        <h1 className="text-white font-bold text-2xl mb-2">You've been invited!</h1>
        <p className="text-brand-subtle text-sm mb-6 leading-relaxed">
          Your friend invited you to Dramatique. Sign up now and get <span className="text-white font-bold">10 free coins</span> to start watching.
        </p>

        {/* REFERRAL CODE */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-4 mb-6 inline-block">
          <p className="text-brand-subtle text-xs mb-1">Referral code</p>
          <p className="text-white font-black text-xl tracking-widest">{params.code}</p>
        </div>

        {/* WHAT YOU GET */}
        <div className="bg-gradient-to-r from-brand-red/10 to-brand-dark border border-brand-red/20 rounded-2xl p-4 mb-6 text-left">
          <p className="text-white font-bold text-sm mb-3">What you get for free:</p>
          <div className="space-y-2">
            {['🪙 10 coins on sign up', '▶ First 2 episodes of every series free', '📅 +5 coins every day you check in', '👑 VIP trial available'].map(item => (
              <div key={item} className="flex items-center gap-2 text-brand-text text-xs">{item}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href="/login" className="w-full btn-primary py-3.5 text-base flex items-center justify-center mb-3">
          Claim 10 Free Coins →
        </Link>
        <p className="text-brand-muted text-xs">No credit card required · Free to sign up</p>

      </div>
    </main>
  )
}
