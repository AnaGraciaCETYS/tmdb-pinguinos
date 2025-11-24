import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import tmdbService from '@/services/tmdbService'

export const useMoviesStore = defineStore('movies', () => {
  // State
  const popularMovies = ref([])
  const topRatedMovies = ref([])
  const nowPlayingMovies = ref([])
  const upcomingMovies = ref([])
  const currentMovie = ref(null)
  const searchResults = ref([])
  const genres = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const hasMovies = computed(() => {
    return popularMovies.value.length > 0 ||
           topRatedMovies.value.length > 0 ||
           nowPlayingMovies.value.length > 0 ||
           upcomingMovies.value.length > 0
  })

  // Actions
  async function fetchPopularMovies(page = 1) {
    try {
      loading.value = true
      error.value = null
      const response = await tmdbService.getPopularMovies(page)
      if (page === 1) {
        popularMovies.value = response.data.results
      } else {
        popularMovies.value.push(...response.data.results)
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTopRatedMovies(page = 1) {
    try {
      loading.value = true
      error.value = null
      const response = await tmdbService.getTopRatedMovies(page)
      if (page === 1) {
        topRatedMovies.value = response.data.results
      } else {
        topRatedMovies.value.push(...response.data.results)
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchNowPlayingMovies(page = 1) {
    try {
      loading.value = true
      error.value = null
      const response = await tmdbService.getNowPlayingMovies(page)
      if (page === 1) {
        nowPlayingMovies.value = response.data.results
      } else {
        nowPlayingMovies.value.push(...response.data.results)
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUpcomingMovies(page = 1) {
    try {
      loading.value = true
      error.value = null
      const response = await tmdbService.getUpcomingMovies(page)
      if (page === 1) {
        upcomingMovies.value = response.data.results
      } else {
        upcomingMovies.value.push(...response.data.results)
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMovieDetails(movieId) {
    try {
      loading.value = true
      error.value = null
      const response = await tmdbService.getMovieDetails(movieId)
      currentMovie.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchMovies(query, page = 1) {
    try {
      loading.value = true
      error.value = null
      const response = await tmdbService.searchMovies(query, page)
      if (page === 1) {
        searchResults.value = response.data.results
      } else {
        searchResults.value.push(...response.data.results)
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchGenres() {
    try {
      const response = await tmdbService.getGenres()
      genres.value = response.data.genres
      return response.data.genres
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  function clearSearchResults() {
    searchResults.value = []
  }

  function clearCurrentMovie() {
    currentMovie.value = null
  }

  return {
    // State
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    currentMovie,
    searchResults,
    genres,
    loading,
    error,
    // Getters
    hasMovies,
    // Actions
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchMovieDetails,
    searchMovies,
    fetchGenres,
    clearSearchResults,
    clearCurrentMovie
  }
})

