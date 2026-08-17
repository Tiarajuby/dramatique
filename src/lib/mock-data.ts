import { Series, FeedSection } from '@/types'
const T = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
]
const H = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1400&h=800&fit=crop',
]
export const MOCK_SERIES: Series[] = [
  { id:'1',title:'Forbidden CEO',slug:'forbidden-ceo',genre:'CEO Romance',synopsis:'She vowed never to love again. He vowed never to feel. One contract changes everything.',thumbnail_url:T[0],hero_url:H[0],language:'English',total_episodes:45,lock_from_episode:7,coin_cost_per_episode:5,is_published:true,created_at:'2026-08-01',is_new:true,is_trending:true,views:2400000,rating:4.8,tags:['Billionaire','Fake Marriage','Slow Burn']},
  { id:'2',title:'Revenge at Dawn',slug:'revenge-at-dawn',genre:'Revenge',synopsis:'They destroyed her family. She spent 10 years building her empire. Now it\'s her turn.',thumbnail_url:T[1],hero_url:H[1],language:'English',total_episodes:32,lock_from_episode:5,coin_cost_per_episode:5,is_published:true,created_at:'2026-08-05',is_new:true,is_trending:true,views:1800000,rating:4.9,tags:['Comeback','Empire','Betrayal']},
  { id:'3',title:'The Alpha\'s Secret',slug:'the-alphas-secret',genre:'Supernatural',synopsis:'He is the most powerful werewolf in the city. She is the only human who can break his curse.',thumbnail_url:T[2],hero_url:H[2],language:'English',total_episodes:60,lock_from_episode:10,coin_cost_per_episode:5,is_published:true,created_at:'2026-07-20',is_trending:true,views:3200000,rating:4.7,tags:['Werewolf','Curse','Fated Mates']},
  { id:'4',title:'Midnight Prosecutor',slug:'midnight-prosecutor',genre:'Crime Thriller',synopsis:'The city\'s most feared lawyer by day. A vigilante by night. Until she becomes the suspect.',thumbnail_url:T[3],language:'English',total_episodes:28,lock_from_episode:6,coin_cost_per_episode:5,is_published:true,created_at:'2026-08-10',is_new:true,views:980000,rating:4.6,tags:['Vigilante','Courtroom','Twist']},
  { id:'5',title:'Love in Exile',slug:'love-in-exile',genre:'Forbidden Love',synopsis:'Arranged to marry his brother. Falling for him instead. Some rules were made to be broken.',thumbnail_url:T[4],language:'English',total_episodes:38,lock_from_episode:8,coin_cost_per_episode:5,is_published:true,created_at:'2026-07-15',is_vip:true,views:2100000,rating:4.5,tags:['Arranged','Forbidden','Family']},
  { id:'6',title:'Dragon\'s Bride',slug:'dragons-bride',genre:'Fantasy',synopsis:'She was sacrificed to the dragon king. He was cursed to destroy everything he loves.',thumbnail_url:T[5],language:'English',total_episodes:55,lock_from_episode:12,coin_cost_per_episode:5,is_published:true,created_at:'2026-06-01',is_trending:true,views:4500000,rating:4.9,tags:['Dragon','Sacrifice','Epic']},
  { id:'7',title:'The Billionaire\'s Lie',slug:'the-billionaires-lie',genre:'CEO Romance',synopsis:'A fake marriage for business. Real feelings were never part of the deal.',thumbnail_url:T[6],language:'English',total_episodes:40,lock_from_episode:7,coin_cost_per_episode:5,is_published:true,created_at:'2026-05-20',is_vip:true,views:3800000,rating:4.8,tags:['Billionaire','Contract','Enemies']},
  { id:'8',title:'Ghost of Regret',slug:'ghost-of-regret',genre:'Supernatural',synopsis:'She can see the dead. He is the ghost who refuses to leave. Neither expected this.',thumbnail_url:T[7],language:'English',total_episodes:25,lock_from_episode:5,coin_cost_per_episode:5,is_published:true,created_at:'2026-08-12',is_new:true,views:760000,rating:4.4,tags:['Ghost','Mystery','Bittersweet']},
]

// Continue Watching — a per-user slice with progress. In production this comes from watch_progress.
export const MOCK_CONTINUE: Series[] = [
  { ...MOCK_SERIES[0], progress: 65, last_episode: 4 },
  { ...MOCK_SERIES[2], progress: 30, last_episode: 8 },
  { ...MOCK_SERIES[5], progress: 82, last_episode: 11 },
]

export const MOCK_FEED: FeedSection[] = [
  { id:'trending', title:'Trending Now', subtitle:'What everyone\'s watching', kind:'ranked', series:[...MOCK_SERIES].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,6) },
  { id:'new', title:'New & Hot', subtitle:'Fresh drops this week', kind:'standard', series:MOCK_SERIES.filter(s=>s.is_new) },
  { id:'ceo', title:'CEO Romance', kind:'standard', series:MOCK_SERIES.filter(s=>s.genre==='CEO Romance') },
  { id:'vip', title:'VIP Exclusives', subtitle:'Unlimited with VIP', kind:'standard', series:MOCK_SERIES.filter(s=>s.is_vip) },
  { id:'super', title:'Supernatural & Fantasy', kind:'standard', series:MOCK_SERIES.filter(s=>['Supernatural','Fantasy'].includes(s.genre)) },
  { id:'picks', title:'Top Rated', subtitle:'Highest rated on Dramatiqué', kind:'standard', series:[...MOCK_SERIES].sort((a,b)=>(b.rating||0)-(a.rating||0)) },
]
export const HERO_SERIES = MOCK_SERIES.slice(0,3)
