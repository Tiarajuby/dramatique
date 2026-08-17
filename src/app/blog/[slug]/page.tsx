'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        {/* BACK */}
        <Link href="/blog" className="flex items-center gap-2 text-brand-subtle hover:text-white text-sm mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to Blog
        </Link>

        {/* HERO IMAGE */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop"
            alt="Blog post"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
        </div>

        {/* META */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-wider">CEO Romance</span>
          <span className="text-brand-border">·</span>
          <span className="text-brand-subtle text-xs">14 Aug 2026</span>
          <span className="text-brand-border">·</span>
          <span className="text-brand-subtle text-xs">5 min read</span>
        </div>

        {/* TITLE */}
        <h1 className="text-white font-bold text-2xl md:text-3xl mb-4 leading-tight">
          Top 10 CEO Romance Series You Can't Stop Watching
        </h1>

        {/* EXCERPT */}
        <p className="text-brand-subtle text-base leading-relaxed mb-8 border-l-2 border-brand-red pl-4">
          From billionaire contracts to fake marriages — these series will keep you up all night binge-watching every episode.
        </p>

        {/* CONTENT */}
        <div className="prose prose-invert max-w-none">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="mb-8">
              <h2 className="text-white font-bold text-lg mb-3">#{i}. The Billionaire's Secret Contract</h2>
              <p className="text-brand-subtle text-sm leading-relaxed mb-3">
                A fake marriage. A real billionaire. And feelings that were never supposed to happen. This series has everything — power dynamics, slow burn romance, and a cliffhanger at the end of every single episode that will have you immediately tapping next.
              </p>
              <div className="bg-brand-card border border-brand-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-16 rounded-lg bg-brand-dark flex-shrink-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=150&fit=crop" alt="Series thumbnail" className="w-full h-full object-cover" />                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Forbidden CEO</p>
                  <p className="text-brand-subtle text-xs mb-2">45 episodes · CEO Romance</p>
                  <Link href="/series/forbidden-ceo" className="text-brand-red text-xs font-bold hover:text-red-400 transition-colors">Watch Now →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-brand-border">
          {['CEO Romance', 'Billionaire', 'Fake Marriage', 'Drama', 'Top 10'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-brand-card border border-brand-border rounded-full text-xs text-brand-text">#{tag}</span>
          ))}
        </div>

        {/* MORE POSTS */}
        <div className="mt-10">
          <h3 className="text-white font-bold text-lg mb-4">More from the Blog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { slug: 'best-revenge-dramas-2026', title: 'Best Revenge Dramas of 2026', category: 'Revenge' },
              { slug: 'supernatural-romance-guide', title: 'Guide to Supernatural Romance', category: 'Supernatural' },
            ].map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-brand-card border border-brand-border rounded-xl p-4 hover:border-brand-muted transition-colors group">
                <span className="text-brand-red text-[10px] font-bold uppercase tracking-wider">{p.category}</span>
                <p className="text-white font-semibold text-sm mt-1 group-hover:text-brand-red transition-colors">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}