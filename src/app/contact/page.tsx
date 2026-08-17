'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Clock } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-5 md:px-8">

        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl mb-2">Contact Us</h1>
          <p className="text-brand-subtle text-sm">We're here to help. Reach out anytime.</p>
        </div>

        {/* CONTACT OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { icon: Mail, label: 'Email', value: 'support@dramatique.com', desc: 'For general queries' },
            { icon: MessageCircle, label: 'Live Chat', value: 'Coming Soon', desc: 'Real-time support' },
            { icon: Clock, label: 'Response Time', value: '< 24 hours', desc: 'Business days' },
          ].map(({ icon: Icon, label, value, desc }) => (
            <div key={label} className="bg-brand-card border border-brand-border rounded-xl p-4 text-center">
              <Icon size={20} className="text-brand-red mx-auto mb-2" />
              <p className="text-brand-subtle text-xs mb-1">{label}</p>
              <p className="text-white font-bold text-sm">{value}</p>
              <p className="text-brand-muted text-[10px] mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* FORM */}
        {!sent ? (
          <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-bold text-base mb-2">Send us a message</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-brand-subtle text-xs mb-1.5 block">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                  placeholder="Your name"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-brand-muted text-sm outline-none focus:border-brand-red transition-colors" />
              </div>
              <div>
                <label className="text-brand-subtle text-xs mb-1.5 block">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
                  placeholder="you@example.com"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-brand-muted text-sm outline-none focus:border-brand-red transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-brand-subtle text-xs mb-1.5 block">Subject</label>
              <select value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} required
                className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-red transition-colors">
                <option value="">Select a topic</option>
                <option>Payment Issue</option>
                <option>Coin Problem</option>
                <option>VIP Subscription</option>
                <option>Technical Issue</option>
                <option>Refund Request</option>
                <option>Content Issue</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-brand-subtle text-xs mb-1.5 block">Message</label>
              <textarea required value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))}
                placeholder="Describe your issue in detail..."
                rows={5}
                className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-white placeholder-brand-muted text-sm outline-none focus:border-brand-red transition-colors resize-none" />
            </div>

            <button type="submit" className="w-full btn-primary py-3">Send Message</button>
          </form>
        ) : (
          <div className="bg-brand-card border border-green-500/30 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
            <p className="text-brand-subtle text-sm">We'll get back to you within 24 hours at {form.email}</p>
          </div>
        )}

      </div>
    </main>
  )
}
