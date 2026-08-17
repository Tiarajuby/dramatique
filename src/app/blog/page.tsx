import Link from 'next/link'

const POSTS = [
  { slug: 'top-10-ceo-romance-series', title: 'Top 10 CEO Romance Series You Can\'t Stop Watching', excerpt: 'From billionaire contracts to fake marriages — these series will keep you up all night.', category: 'CEO Romance', date: '14 Aug 2026', readTime: '5 min', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop', featured: true },
  { slug: 'best-revenge-dramas-2026', title: 'Best Revenge Dramas of 2026 — Ranked', excerpt: 'She came back stronger. These revenge arcs will leave you cheering at every twist.', category: 'Revenge', date: '12 Aug 2026', readTime: '4 min', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&h=400&fit=crop', featured: false },
  { slug: 'supernatural-romance-guide', title: 'Your Complete Guide to Supernatural Romance Dramas', excerpt: 'Werewolves, vampires, dragons — and the humans who love them. Everything you need to know.', category: 'Supernatural', date: '10 Aug 2026', readTime: '6 min', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=400&fit=crop', featured: false },
  { slug: 'why-micro-dramas-are-the-future', title: 'Why Micro Dramas Are Taking Over the World', excerpt: 'Short episodes. Big emotions. The format that\'s changing how we watch stories.', category: 'Industry', date: '8 Aug 2026', readTime: '3 min', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=400&fit=crop', featured: false },
  { slug: 'forbidden-love-series-ranked', title: '8 Forbidden Love Series That Broke Our Hearts', excerpt: 'Some loves were never meant to be. But we watched every episode anyway.', category: 'Forbidden Love', date: '6 Aug 2026', readTime: '4 min', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=400&fit=crop', featured: false },
  { slug: 'crime-thriller-dramas-2026', title: 'Crime Thriller Micro Dramas — The Best of 2026', excerpt: 'Plot twists, cliffhangers, and suspects everywhere. These will keep you guessing.', category: 'Crime Thriller', date: '4 Aug 2026', readTime: '5 min', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=400&fit=crop', featured: false },
]

const CATEGORIES = ['All', 'CEO Romance', 'Revenge', 'Supernatural', 'Forbidden Love', 'Crime Thriller', 'Industry']

export default function BlogPage() {
  const featured = POSTS.find(p => p.featured)
  const rest = POSTS.filter(p => !p.featured)

  return (
    <main className="min-h-screen bg-brand-black pt-20 pb-24 md:pb-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl mb-2">Blog</h1>
          <p className="text-brand-subtle text-sm">Drama guides, rankings, and stories from the Dramatique team</p>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex gap-2 overflow-x-auto scroll-hide mb-8 pb-1">
          {CATEGORIES.map(c => (
            <button key={c} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${c === 'All' ? 'bg-brand-red border-brand-red text-white' : 'border-brand-border text-brand-text hover:border-brand-muted hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* FEATURED POST */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block mb-10 group">
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
              <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="badge-new mb-2 inline-block">Featured</span>
                <span className="ml-2 text-brand-red text-xs font-bold uppercase tracking-wider">{featured.category}</span>
                <h2 className="text-white font-bold text-xl md:text-2xl mt-1 mb-2 group-hover:text-brand-red transition-colors">{featured.title}</h2>
                <p className="text-brand-subtle text-sm line-clamp-2 mb-3">{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-brand-muted text-xs">
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime} read</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* POST GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-muted transition-colors">
              <div className="relative h-44 overflow-hidden">
                <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="bg-brand-black/70 text-brand-red text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">{post.title}</h3>
                <p className="text-brand-subtle text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-brand-muted text-[10px]">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime} read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
