// ── CATEGORIES ──────────────────────────────────────
export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Romance', slug: 'romance', icon: '❤️', color: '#e8001d', description: 'Love stories of all kinds', display_order: 1, is_active: true, series_count: 24 },
  { id: 'cat-2', name: 'Thriller', slug: 'thriller', icon: '🔍', color: '#f59e0b', description: 'Edge-of-your-seat drama', display_order: 2, is_active: true, series_count: 18 },
  { id: 'cat-3', name: 'Fantasy & Supernatural', slug: 'fantasy', icon: '🌙', color: '#8b5cf6', description: 'Magic, werewolves, dragons', display_order: 3, is_active: true, series_count: 15 },
  { id: 'cat-4', name: 'Drama', slug: 'drama', icon: '🎭', color: '#3b82f6', description: 'Real life, real emotions', display_order: 4, is_active: true, series_count: 12 },
  { id: 'cat-5', name: 'Action', slug: 'action', icon: '⚔️', color: '#10b981', description: 'High stakes and fast pace', display_order: 5, is_active: true, series_count: 8 },
]

export const MOCK_SUBCATEGORIES = [
  { id: 'sub-1', category_id: 'cat-1', name: 'CEO Romance', slug: 'ceo-romance', icon: '💼', display_order: 1, is_active: true, series_count: 12 },
  { id: 'sub-2', category_id: 'cat-1', name: 'Forbidden Love', slug: 'forbidden-love', icon: '❤️‍🔥', display_order: 2, is_active: true, series_count: 8 },
  { id: 'sub-3', category_id: 'cat-1', name: 'Arranged Marriage', slug: 'arranged-marriage', icon: '💍', display_order: 3, is_active: true, series_count: 4 },
  { id: 'sub-4', category_id: 'cat-1', name: 'Second Chance Love', slug: 'second-chance', icon: '🔄', display_order: 4, is_active: true, series_count: 3 },
  { id: 'sub-5', category_id: 'cat-2', name: 'Crime Thriller', slug: 'crime-thriller', icon: '🔫', display_order: 1, is_active: true, series_count: 10 },
  { id: 'sub-6', category_id: 'cat-2', name: 'Revenge', slug: 'revenge', icon: '⚔️', display_order: 2, is_active: true, series_count: 8 },
  { id: 'sub-7', category_id: 'cat-2', name: 'Psychological Thriller', slug: 'psychological', icon: '🧠', display_order: 3, is_active: true, series_count: 4 },
  { id: 'sub-8', category_id: 'cat-3', name: 'Supernatural', slug: 'supernatural', icon: '👻', display_order: 1, is_active: true, series_count: 7 },
  { id: 'sub-9', category_id: 'cat-3', name: 'Werewolf', slug: 'werewolf', icon: '🐺', display_order: 2, is_active: true, series_count: 4 },
  { id: 'sub-10', category_id: 'cat-3', name: 'Dragon & Fantasy', slug: 'dragon-fantasy', icon: '🐉', display_order: 3, is_active: true, series_count: 4 },
  { id: 'sub-11', category_id: 'cat-3', name: 'Reincarnation', slug: 'reincarnation', icon: '✨', display_order: 4, is_active: true, series_count: 3 },
  { id: 'sub-12', category_id: 'cat-4', name: 'Family Drama', slug: 'family-drama', icon: '👨‍👩‍👧', display_order: 1, is_active: true, series_count: 6 },
  { id: 'sub-13', category_id: 'cat-4', name: 'Office Drama', slug: 'office-drama', icon: '🏢', display_order: 2, is_active: true, series_count: 4 },
  { id: 'sub-14', category_id: 'cat-4', name: 'School Drama', slug: 'school-drama', icon: '🏫', display_order: 3, is_active: true, series_count: 2 },
]

// ── SERIES ──────────────────────────────────────
export const ADMIN_SERIES = [
  { id: '1', title: 'Forbidden CEO', slug: 'forbidden-ceo', primary_category: 'Romance', subcategories: ['CEO Romance', 'Forbidden Love'], language: 'English', total_episodes: 45, lock_from_episode: 7, coin_cost: 5, status: 'published', views: 2400000, revenue: 48000, created_at: '2026-08-01' },
  { id: '2', title: 'Revenge at Dawn', slug: 'revenge-at-dawn', primary_category: 'Thriller', subcategories: ['Revenge'], language: 'English', total_episodes: 32, lock_from_episode: 5, coin_cost: 5, status: 'published', views: 1800000, revenue: 36000, created_at: '2026-08-05' },
  { id: '3', title: "The Alpha's Secret", slug: 'the-alphas-secret', primary_category: 'Fantasy & Supernatural', subcategories: ['Werewolf', 'Supernatural'], language: 'English', total_episodes: 60, lock_from_episode: 10, coin_cost: 5, status: 'published', views: 3200000, revenue: 64000, created_at: '2026-07-20' },
  { id: '4', title: 'Midnight Prosecutor', slug: 'midnight-prosecutor', primary_category: 'Thriller', subcategories: ['Crime Thriller'], language: 'English', total_episodes: 28, lock_from_episode: 6, coin_cost: 5, status: 'published', views: 980000, revenue: 19600, created_at: '2026-08-10' },
  { id: '5', title: 'Love in Exile', slug: 'love-in-exile', primary_category: 'Romance', subcategories: ['Forbidden Love', 'Arranged Marriage'], language: 'English', total_episodes: 38, lock_from_episode: 8, coin_cost: 5, status: 'draft', views: 0, revenue: 0, created_at: '2026-08-14' },
]

// ── EPISODES ──────────────────────────────────────
export const ADMIN_EPISODES = Array.from({ length: 15 }, (_, i) => ({
  id: `ep-${i + 1}`,
  series_id: '1',
  number: i + 1,
  title: `Episode ${i + 1}`,
  duration_seconds: 55 + Math.floor(Math.random() * 20),
  is_free: i < 2,
  coin_cost: i < 2 ? 0 : 5,
  video_url: i < 3 ? `https://cloudflarestream.com/ep${i + 1}` : '',
  status: i < 3 ? 'ready' : i < 5 ? 'processing' : 'pending',
  views: i < 3 ? Math.floor(Math.random() * 100000) : 0,
  created_at: '2026-08-01',
}))

// ── USERS ──────────────────────────────────────
export const ADMIN_USERS = [
  { id: 'u1', display_name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya@email.com', coins: 45, is_vip: true, vip_until: '2026-09-15', total_spent: 1235, joined: '2026-08-01', status: 'active' },
  { id: 'u2', display_name: 'Sarah Johnson', phone: '+1 555 234 5678', email: 'sarah@email.com', coins: 12, is_vip: false, vip_until: null, total_spent: 285, joined: '2026-08-03', status: 'active' },
  { id: 'u3', display_name: 'Meera Nair', phone: '+91 87654 32109', email: 'meera@email.com', coins: 0, is_vip: false, vip_until: null, total_spent: 89, joined: '2026-08-05', status: 'active' },
  { id: 'u4', display_name: 'Lisa Chen', phone: '+65 9123 4567', email: 'lisa@email.com', coins: 350, is_vip: true, vip_until: '2026-08-31', total_spent: 2850, joined: '2026-07-20', status: 'active' },
  { id: 'u5', display_name: 'Ananya Patel', phone: '+91 76543 21098', email: 'ananya@email.com', coins: 5, is_vip: false, vip_until: null, total_spent: 0, joined: '2026-08-14', status: 'active' },
]

// ── TRANSACTIONS ──────────────────────────────────────
export const ADMIN_TRANSACTIONS = [
  { id: 'TXN001', user_name: 'Priya Sharma', type: 'purchase', desc: '350 Coins Pack', amount_inr: 950, coins: 350, gateway: 'razorpay', status: 'success', date: '2026-08-15 10:23' },
  { id: 'TXN002', user_name: 'Sarah Johnson', type: 'vip', desc: 'VIP Monthly', amount_inr: 950, coins: 0, gateway: 'stripe', status: 'success', date: '2026-08-15 09:45' },
  { id: 'TXN003', user_name: 'Lisa Chen', type: 'purchase', desc: '1200 Coins Pack', amount_inr: 2850, coins: 1200, gateway: 'stripe', status: 'success', date: '2026-08-14 22:10' },
  { id: 'TXN004', user_name: 'Meera Nair', type: 'purchase', desc: '30 Coins Pack', amount_inr: 89, coins: 30, gateway: 'razorpay', status: 'failed', date: '2026-08-14 18:30' },
  { id: 'TXN005', user_name: 'Ananya Patel', type: 'purchase', desc: '100 Coins Pack', amount_inr: 285, coins: 100, gateway: 'razorpay', status: 'success', date: '2026-08-14 15:20' },
]

// ── DASHBOARD STATS ──────────────────────────────────────
export const DASHBOARD_STATS = {
  users: { total: 12450, today: 234, week: 1820 },
  series: { total: 24, published: 19, draft: 5 },
  episodes: { total: 847 },
  revenue: { today: 45600, week: 312000, month: 1240000 },
  vip: { active: 892 },
  paywallHitRate: 68,
  adUnlockRate: 34,
  coinTransactions: { today: 156 },
}

// ── CHART DATA ──────────────────────────────────────
export const REVENUE_CHART = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  revenue: Math.floor(20000 + Math.random() * 60000),
  users: Math.floor(100 + Math.random() * 300),
}))

export const TOP_SERIES = [
  { title: "The Alpha's Secret", views: 3200000, revenue: 64000 },
  { title: 'Forbidden CEO', views: 2400000, revenue: 48000 },
  { title: 'Love in Exile', views: 2100000, revenue: 42000 },
  { title: "The Billionaire's Lie", views: 1900000, revenue: 38000 },
  { title: 'Revenge at Dawn', views: 1800000, revenue: 36000 },
]
