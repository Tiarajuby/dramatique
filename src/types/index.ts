export interface Series {
  id: string; title: string; slug: string; genre: string; synopsis: string;
  thumbnail_url: string; hero_url?: string; language: string; total_episodes: number;
  lock_from_episode: number; coin_cost_per_episode: number; is_published: boolean;
  created_at: string; is_new?: boolean; views?: number; rating?: number;
  // Optional presentation/state fields — safe to omit, cards degrade gracefully
  is_vip?: boolean;          // VIP-exclusive title
  is_trending?: boolean;     // shows a trending flame rank
  tags?: string[];           // sub-genre tags for detail/hover
  // Per-user progress (populated for Continue Watching)
  progress?: number;         // 0-100 percentage watched of current episode
  last_episode?: number;     // episode the user last watched
}
export interface FeedSection {
  id: string;
  title: string;
  series: Series[];
  kind?: 'standard' | 'continue' | 'spotlight' | 'ranked'; // controls row rendering
  subtitle?: string;
}
export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' }, { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳' }, { code: 'te', label: 'Telugu', flag: '🇮🇳' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' }, { code: 'pt', label: 'Portuguese', flag: '🇧🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' }, { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' }, { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' }, { code: 'id', label: 'Bahasa', flag: '🇮🇩' },
]
export const GENRES = ['CEO Romance','Supernatural','Revenge','Forbidden Love','Crime Thriller','Fantasy','Family Drama','Reincarnation','Arranged Marriage']
