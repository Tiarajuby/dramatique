'use client'

import { useSeriesFeed, useHeroSeries, useContinueWatching } from '@/hooks'
import HeroBanner from '@/components/series/HeroBanner'
import SeriesRow from '@/components/series/SeriesRow'
import GenreDiscovery from '@/components/series/GenreDiscovery'

const SEE_ALL: Record<string, string> = {
  trending: '/new-hot',
  new: '/new-hot',
  ceo: '/categories?genre=CEO+Romance',
  vip: '/vip',
  super: '/categories?genre=Supernatural',
  picks: '/new-hot',
}

export default function HomePage() {
  const { data: feed, isLoading: feedLoading } = useSeriesFeed()
  const { data: heroSeries, isLoading: heroLoading } = useHeroSeries()
  const { data: continueWatching } = useContinueWatching()

  return (
    <main className="min-h-screen bg-brand-black">
      <HeroBanner series={heroSeries || []} loading={heroLoading} />

      <div className="pb-24 md:pb-12 relative z-10 -mt-8 md:-mt-16">
        {/* Continue Watching leads — the fastest path back into the product */}
        {continueWatching && continueWatching.length > 0 && (
          <SeriesRow
            title="Continue Watching"
            subtitle="Pick up where you left off"
            kind="continue"
            series={continueWatching}
          />
        )}

        {feedLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SeriesRow key={i} title="" series={[]} loading={true} />
            ))
          : feed?.map((section, idx) => (
              <div key={section.id}>
                <SeriesRow
                  title={section.title}
                  subtitle={section.subtitle}
                  kind={section.kind}
                  series={section.series}
                  seeAllHref={SEE_ALL[section.id]}
                />
                {/* Genre discovery injected mid-feed for browsing variety */}
                {idx === 1 && <GenreDiscovery />}
              </div>
            ))
        }
      </div>
    </main>
  )
}
