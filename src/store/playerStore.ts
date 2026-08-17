import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PlayerState {
  // State
  currentSeriesId: string | null
  currentEpisodeId: string | null
  currentEpisodeNumber: number
  isPlaying: boolean
  progress: number // 0-100 percentage
  timestamp: number // seconds
  language: string
  subtitles: boolean

  // Actions
  setEpisode: (seriesId: string, episodeId: string, episodeNumber: number) => void
  setPlaying: (playing: boolean) => void
  updateProgress: (timestamp: number, duration: number) => void
  setLanguage: (language: string) => void
  toggleSubtitles: () => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentSeriesId: null,
      currentEpisodeId: null,
      currentEpisodeNumber: 0,
      isPlaying: false,
      progress: 0,
      timestamp: 0,
      language: 'en',
      subtitles: true,

      setEpisode: (seriesId, episodeId, episodeNumber) => {
        set(
          {
            currentSeriesId: seriesId,
            currentEpisodeId: episodeId,
            currentEpisodeNumber: episodeNumber,
            isPlaying: true,
            progress: 0,
            timestamp: 0,
          },
          false,
          'player/setEpisode'
        )
      },

      setPlaying: (playing: boolean) => {
        set({ isPlaying: playing }, false, 'player/setPlaying')
      },

      // Called every 10 seconds during playback
      updateProgress: (timestamp: number, duration: number) => {
        const progress = duration > 0 ? (timestamp / duration) * 100 : 0
        set({ timestamp, progress }, false, 'player/updateProgress')
      },

      setLanguage: (language: string) => {
        set({ language }, false, 'player/setLanguage')
      },

      toggleSubtitles: () => {
        set(state => ({ subtitles: !state.subtitles }), false, 'player/toggleSubtitles')
      },

      reset: () => {
        set(
          {
            currentSeriesId: null,
            currentEpisodeId: null,
            currentEpisodeNumber: 0,
            isPlaying: false,
            progress: 0,
            timestamp: 0,
          },
          false,
          'player/reset'
        )
      },
    }),
    { name: 'PlayerStore' }
  )
)
