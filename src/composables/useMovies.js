import { onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'

/**
 * Composable for movie-related functionality
 * Provides easy access to movies store and common operations
 */
export function useMovies() {
  const moviesStore = useMoviesStore()

  /**
   * Initialize home page data
   * Fetches popular, top rated, now playing, and upcoming movies
   */
  async function initializeHomeData() {
    try {
      await Promise.all([
        moviesStore.fetchPopularMovies(),
        moviesStore.fetchTopRatedMovies(),
        moviesStore.fetchNowPlayingMovies(),
        moviesStore.fetchUpcomingMovies()
      ])
    } catch (error) {
      console.error('Error initializing home data:', error)
    }
  }

  /**
   * Load home data on mount
   */
  function useHomeData() {
    onMounted(() => {
      if (!moviesStore.hasMovies) {
        initializeHomeData()
      }
    })
  }

  return {
    moviesStore,
    initializeHomeData,
    useHomeData
  }
}

