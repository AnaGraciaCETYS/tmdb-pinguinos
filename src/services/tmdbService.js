import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'

// Check if API key is configured
const isApiConfigured = API_KEY && API_KEY !== 'your_tmdb_api_key_here'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  }
})

// Add request interceptor to check API key
apiClient.interceptors.request.use(
  (config) => {
    if (!isApiConfigured) {
      return Promise.reject(new Error('TMDB API key is not configured. Please add VITE_TMDB_API_KEY to your .env file'))
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * TMDB API Service
 * Handles all interactions with The Movie Database API
 */
export const tmdbService = {
  /**
   * Get popular movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Movie list response
   */
  getPopularMovies(page = 1) {
    return apiClient.get('/movie/popular', {
      params: { page }
    })
  },

  /**
   * Get top rated movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Movie list response
   */
  getTopRatedMovies(page = 1) {
    return apiClient.get('/movie/top_rated', {
      params: { page }
    })
  },

  /**
   * Get now playing movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Movie list response
   */
  getNowPlayingMovies(page = 1) {
    return apiClient.get('/movie/now_playing', {
      params: { page }
    })
  },

  /**
   * Get upcoming movies
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Movie list response
   */
  getUpcomingMovies(page = 1) {
    return apiClient.get('/movie/upcoming', {
      params: { page }
    })
  },

  /**
   * Get movie details by ID
   * @param {number} movieId - Movie ID
   * @returns {Promise} Movie details response
   */
  getMovieDetails(movieId) {
    return apiClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar'
      }
    })
  },

  /**
   * Search movies
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Search results response
   */
  searchMovies(query, page = 1) {
    return apiClient.get('/search/movie', {
      params: { query, page }
    })
  },

  /**
   * Get movie genres
   * @returns {Promise} Genres list response
   */
  getGenres() {
    return apiClient.get('/genre/movie/list')
  },

  /**
   * Get movies by genre
   * @param {number} genreId - Genre ID
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Movie list response
   */
  getMoviesByGenre(genreId, page = 1) {
    return apiClient.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page
      }
    })
  }
}

export default tmdbService

