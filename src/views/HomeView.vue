<template>
  <div class="home-view">
    <AppHeader />
    
    <main class="main-content">
      <!-- Simple Header -->
      <section v-if="moviesStore.hasMovies" class="page-header">
        <h1>Movies</h1>
        <p>Browse our collection of movies</p>
      </section>

      <!-- Loading State -->
      <div v-if="moviesStore.loading && !moviesStore.hasMovies" class="loading-container">
        <p>Loading movies...</p>
      </div>

      <!-- Error State -->
      <div v-if="moviesStore.error" class="error-container">
        <p>Error: {{ moviesStore.error }}</p>
        <p v-if="moviesStore.error.includes('API key')" class="error-hint">
          Please add your TMDB API key to the .env file
        </p>
      </div>

      <!-- No API Key State -->
      <div v-if="!moviesStore.loading && !moviesStore.hasMovies && !moviesStore.error" class="setup-hint">
        <h2>Welcome to StreamFlix!</h2>
        <p>To see movies, please add your TMDB API key to the .env file</p>
        <p class="hint-text">Get your API key from: <a href="https://www.themoviedb.org/settings/api" target="_blank">TMDB Settings</a></p>
      </div>

      <!-- Movie Rows -->
      <div v-if="moviesStore.hasMovies">
        <MovieRow
          v-if="moviesStore.popularMovies.length > 0"
          title="Popular Now"
          :movies="moviesStore.popularMovies"
        />
        <MovieRow
          v-if="moviesStore.topRatedMovies.length > 0"
          title="Top Rated"
          :movies="moviesStore.topRatedMovies"
        />
        <MovieRow
          v-if="moviesStore.nowPlayingMovies.length > 0"
          title="Now Playing"
          :movies="moviesStore.nowPlayingMovies"
        />
        <MovieRow
          v-if="moviesStore.upcomingMovies.length > 0"
          title="Coming Soon"
          :movies="moviesStore.upcomingMovies"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import AppHeader from '@/components/AppHeader.vue'
import MovieRow from '@/components/MovieRow.vue'

const moviesStore = useMoviesStore()


onMounted(async () => {
  // Check if API key is configured
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const isApiConfigured = apiKey && apiKey !== 'your_tmdb_api_key_here'
  
  if (!isApiConfigured) {
    // Don't try to fetch if API key is not configured
    return
  }

  if (!moviesStore.hasMovies) {
    try {
      await moviesStore.fetchPopularMovies()
      await moviesStore.fetchTopRatedMovies()
      await moviesStore.fetchNowPlayingMovies()
      await moviesStore.fetchUpcomingMovies()
    } catch (error) {
      // Error is already handled in the store
      console.error('Error fetching movies:', error)
    }
  }
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #000;
}

.main-content {
  padding-top: 2rem;
}

.page-header {
  max-width: 1400px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  color: #fff;
}

.error-container {
  color: #e50914;
  text-align: center;
}

.error-hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: rgba(229, 9, 20, 0.8);
}

.setup-hint {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.setup-hint h2 {
  color: #fff;
  margin-bottom: 1rem;
}

.hint-text {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.hint-text a {
  color: #e50914;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page-header {
    padding: 0 1rem;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }
}
</style>

