export default function PrivacyPage() {
  const sections = [
    { title: 'Information We Collect', content: 'We collect information you provide directly: name, phone number, email address, and payment information. We also collect usage data including watch history, search queries, and device information to improve your experience.' },
    { title: 'How We Use Your Information', content: 'We use your information to provide and improve the service, process payments, send notifications you have opted into, personalise content recommendations, and comply with legal obligations. We do not sell your personal data to third parties.' },
    { title: 'Cookies and Tracking', content: 'We use cookies and similar technologies to maintain your session, remember your preferences, and analyse usage patterns. You can control cookie preferences through your browser settings, though some features may not function properly without cookies.' },
    { title: 'Payment Information', content: 'Payment processing is handled by Razorpay and Stripe. We do not store your full card details on our servers. All payment data is encrypted and processed in accordance with PCI DSS standards.' },
    { title: 'Data Sharing', content: 'We share data with service providers who help us operate the platform (hosting, analytics, payment processing). We may share data if required by law or to protect our rights. We do not share data for advertising purposes.' },
    { title: 'Data Retention', content: 'We retain your account data for as long as your account is active. Watch history is kept for 12 months. Payment records are kept for 7 years as required by law. You can request deletion of your account and associated data at any time.' },
    { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data. You can export your data, withdraw consent for marketing, and opt out of non-essential tracking. Contact privacy@dramatique.com to exercise these rights.' },
    { title: 'Children\'s Privacy', content: 'Dramatique is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete it promptly.' },
    { title: 'Changes to This Policy', content: 'We may update this privacy policy from time to time. We will notify you of significant changes through the app or by email. Continued use of the service after changes constitutes acceptance of the updated policy.' },
    { title: 'Contact Us', content: 'For privacy-related questions or requests, contact our Data Protection Officer at privacy@dramatique.com or write to: Adgraam, Bengaluru, Karnataka, India.' },
  ]

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl mb-2">Privacy Policy</h1>
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
