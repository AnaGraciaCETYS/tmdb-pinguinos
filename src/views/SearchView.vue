<template>
  <div class="search-view">
    <AppHeader />
    
    <main class="search-content">
      <div class="search-header">
        <h1>Search Movies</h1>
        <div class="search-input-container">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Search for movies..."
            class="search-input-large"
          />
          <button @click="performSearch" class="search-button-large">
            Search
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="moviesStore.loading" class="loading-container">
        <p>Searching...</p>
      </div>

      <!-- Error State -->
      <div v-if="moviesStore.error" class="error-container">
        <p>Error: {{ moviesStore.error }}</p>
      </div>

      <!-- Results -->
      <div v-if="!moviesStore.loading && moviesStore.searchResults.length > 0" class="results-container">
        <h2 class="results-title">
          Found {{ moviesStore.searchResults.length }} result(s)
        </h2>
        <div class="movies-grid">
          <MovieCard
            v-for="movie in moviesStore.searchResults"
            :key="movie.id"
            :movie="movie"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-if="!moviesStore.loading && searchQuery && moviesStore.searchResults.length === 0" class="no-results">
        <p>No movies found for "{{ searchQuery }}"</p>
      </div>

      <!-- Empty State -->
      <div v-if="!searchQuery && moviesStore.searchResults.length === 0" class="empty-state">
        <p>Enter a movie title to start searching</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import AppHeader from '@/components/AppHeader.vue'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()
const router = useRouter()
const moviesStore = useMoviesStore()

const searchQuery = ref(route.query.q || '')

// Perform search when query changes from URL
onMounted(async () => {
  if (searchQuery.value) {
    await performSearch()
  } else {
    moviesStore.clearSearchResults()
  }
})

// Watch for URL query changes
watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery || ''
  if (newQuery) {
    performSearch()
  }
})

let searchTimeout = null

function handleSearch() {
  // Debounce search for better UX
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      performSearch()
    }
  }, 500)
}

async function performSearch() {
  if (!searchQuery.value.trim()) {
    moviesStore.clearSearchResults()
    return
  }

  // Update URL
  router.push({ query: { q: searchQuery.value } })

  // Perform search
  try {
    await moviesStore.searchMovies(searchQuery.value)
  } catch (error) {
    console.error('Search error:', error)
  }
}
</script>

<style scoped>
.search-view {
  min-height: 100vh;
  background: #000;
}

.search-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.search-header {
  margin-bottom: 3rem;
}

.search-header h1 {
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  color: #fff;
}

.search-input-container {
  display: flex;
  gap: 1rem;
  max-width: 600px;
}

.search-input-large {
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}

.search-input-large:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: #e50914;
}

.search-input-large::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-button-large {
  padding: 1rem 2rem;
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button-large:hover {
  background: #f40612;
}

.results-container {
  margin-top: 2rem;
}

.results-title {
  font-size: 1.5rem;
  margin: 0 0 2rem 0;
  color: rgba(255, 255, 255, 0.9);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.loading-container,
.error-container,
.no-results,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.error-container {
  color: #e50914;
}

@media (max-width: 768px) {
  .search-content {
    padding: 1rem;
  }

  .search-header h1 {
    font-size: 1.75rem;
  }

  .search-input-container {
    flex-direction: column;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>

