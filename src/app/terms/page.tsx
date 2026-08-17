export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using Dramatique, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to update these terms at any time with notice provided through the platform.' },
    { title: '2. Use of the Service', content: 'Dramatique grants you a limited, non-exclusive, non-transferable licence to access and use the service for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works from any content on the platform without our written consent.' },
    { title: '3. Coins and Payments', content: 'Coins are a virtual currency used within Dramatique to unlock episodes. Coins have no cash value and cannot be refunded, transferred, or exchanged for real money. All purchases are final unless covered by our Refund Policy. Coin balances do not expire.' },
    { title: '4. VIP Subscription', content: 'VIP subscriptions are billed in advance on a monthly or annual basis. You may cancel at any time through your account settings. Cancellation takes effect at the end of the current billing period. No partial refunds are provided for unused subscription time.' },
    { title: '5. Content and Intellectual Property', content: 'All content on Dramatique, including series, episodes, characters, and artwork, is owned by or licensed to Adgraam and is protected by copyright law. Unauthorised reproduction or distribution of content is strictly prohibited.' },
    { title: '6. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account. We reserve the right to terminate accounts that violate these terms.' },
    { title: '7. Prohibited Conduct', content: 'You agree not to use the service for any unlawful purpose, to attempt to gain unauthorised access to any part of the service, to scrape or harvest content, or to interfere with the proper functioning of the platform.' },
    { title: '8. Limitation of Liability', content: 'Dramatique is provided on an "as is" basis. We do not warrant that the service will be uninterrupted or error-free. To the maximum extent permitted by law, we disclaim all liability for any indirect, incidental, or consequential damages.' },
    { title: '9. Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.' },
    { title: '10. Contact', content: 'For questions about these terms, contact us at legal@dramatique.com or through our Help & Support page.' },
  ]

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl mb-2">Terms of Service</h1>
          <p className="text-brand-subtle text-sm">Last updated: 15 August 2026</p>
        </div>
        <div className="space-y-6">
          {sections.map(s => (
            <div key={s.title} className="bg-brand-card border border-brand-border rounded-xl p-5">
              <h2 className="text-white font-bold text-base mb-3">{s.title}</h2>
              <p className="text-brand-subtle text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
