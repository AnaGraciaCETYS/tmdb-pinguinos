<template>
  <div class="favorites-view">
    <AppHeader />

    <main class="main-content">
      <section class="page-header">
        <h1>Favorites</h1>
        <p>Your saved movies</p>
      </section>

      <div v-if="loading" class="loading-container">
        <p>Loading favorites...</p>
      </div>

      <div v-if="error" class="error-container">
        <p>Error: {{ error }}</p>
      </div>

      <div v-if="!loading && movies.length === 0" class="empty-state">
        <p>No favorites yet. Click the heart on any movie to add it here.</p>
      </div>

      <div v-if="movies.length > 0">
        <MovieRow title="Favorites" :movies="movies" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MovieRow from '@/components/MovieRow.vue'
import { useAuthStore } from '@/stores/auth'
import { db } from '@/config/firebase'
import { collection, getDocs } from 'firebase/firestore'
import tmdbService from '@/services/tmdbService'

const authStore = useAuthStore()
const movies = ref([])
const loading = ref(false)
const error = ref(null)

async function loadFavorites() {
  loading.value = true
  error.value = null
  movies.value = []

  try {
    // If Firebase available and user signed in, read favorites collection
    if (db && authStore.user) {
      const favsRef = collection(db, 'users', String(authStore.user.uid), 'favorites')
      const snap = await getDocs(favsRef)
      movies.value = snap.docs.map(d => d.data()).filter(Boolean)
      loading.value = false
      return
    }

    // Fallback: read from localStorage 'local_favs' (array of ids)
    const key = 'local_favs'
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    if (!data.length) {
      movies.value = []
      loading.value = false
      return
    }

    // If TMDB API configured, fetch details for each id
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const isApiConfigured = apiKey && apiKey !== 'your_tmdb_api_key_here'
    if (!isApiConfigured) {
      // create minimal objects with id only (poster will be placeholder)
      movies.value = data.map(id => ({ id: parseInt(id), title: 'Unknown', poster_path: null }))
      loading.value = false
      return
    }

    // fetch details
    const promises = data.map((id) => tmdbService.getMovieDetails(id).then(res => res.data).catch(() => null))
    const results = await Promise.all(promises)
    movies.value = results.filter(Boolean)
  } catch (e) {
    console.error('Error loading favorites:', e)
    error.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFavorites()
  // listen for in-tab favorites updates
  window.addEventListener('favorites-updated', loadFavorites)
})
</script>

<style scoped>
.favorites-view { min-height: 100vh; background: #000 }
.main-content { padding-top: 2rem }
.page-header { max-width: 1400px; margin: 0 auto 2rem; padding: 0 2rem; text-align: center }
.page-header h1 { color: #fff; font-size: 2.5rem; margin: 0 0 0.5rem 0 }
.page-header p { color: rgba(255,255,255,0.75) }
.loading-container, .error-container, .empty-state { text-align: center; padding: 2rem; color: #fff }
</style>
