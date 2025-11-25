<template>
  <div class="movie-details-view">
    <AppHeader />
    
    <main class="main-content">
      <!-- Loading State -->
      <div v-if="moviesStore.loading" class="loading-container">
        <p>Loading movie details...</p>
      </div>

      <!-- Error State -->
      <div v-if="moviesStore.error" class="error-container">
        <p>Error: {{ moviesStore.error }}</p>
      </div>

      <!-- Movie Details -->
      <div v-if="movie && !moviesStore.loading" class="movie-details-container">
        <div class="movie-content">
          <!-- Poster Section -->
          <div class="poster-section">
            <img
              :src="posterUrl"
              :alt="movie.title"
              class="movie-poster"
              @error="handleImageError"
            />
            <!-- Favorite heart button -->
            <button
              class="fav-button"
              :class="{ active: isFavorite }"
              @click="toggleFavorite"
              :aria-pressed="isFavorite"
              title="Add to favorites"
            >
              <svg viewBox="0 0 24 24" class="heart-icon" aria-hidden="true" focusable="false">
                <path
                  d="M12.1 21s-7.4-4.35-9.2-6.2C-0.1 11.6 2.1 6 6.6 6c2.4 0 3.9 1.6 4.5 2.3C11.5 7.6 13 6 15.4 6 19.9 6 22.1 11.6 21.1 14.8c-1.8 1.85-9 6.2-9 6.2z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
            </button>
            
            <!-- Rating Stars -->
            <div class="rating-container">
              <!-- TMDB Rating -->
              <div class="rating-section">
                <p class="rating-label">TMDB Rating</p>
                <div class="stars">
                  <span
                    v-for="star in 5"
                    :key="`tmdb-${star}`"
                    class="star"
                    :class="{ filled: star <= filledStars }"
                  >
                    ★
                  </span>
                </div>
                <span class="rating-text">{{ ratingText }}</span>
              </div>

              <!-- User Rating -->
              <div v-if="authStore.user" class="rating-section user-rating">
                <p class="rating-label">Your Rating</p>
                <div class="stars interactive" @mouseleave="resetHover">
                  <span
                    v-for="star in 5"
                    :key="`user-${star}`"
                    class="star interactive-star"
                    :class="{ 
                      filled: star <= userRating || star <= hoveredStar,
                      hover: star <= hoveredStar && hoveredStar > 0
                    }"
                    @click="setUserRating(star)"
                    @mouseenter="hoveredStar = star"
                  >
                    ★
                  </span>
                </div>
                <span v-if="isSavingRating" class="rating-text">Saving...</span>
                <span v-else-if="saveSuccess" class="rating-text">Saved ✓</span>
                <span v-else-if="userRating" class="rating-text">{{ userRating }} / 5</span>
                <span v-else class="rating-text hint">Click to rate</span>
                <p v-if="saveError" class="error">{{ saveError }}</p>
              </div>
              <div v-else class="login-prompt">
                <p class="rating-label">Rate this movie</p>
                <p class="login-text">Please sign in to rate movies</p>
              </div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <h1 class="movie-title">{{ movie.title }}</h1>
            
            <div class="movie-synopsis">
              <h2>Synopsis</h2>
              <p>{{ movie.overview || 'No synopsis available.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'
import { getImageUrl } from '@/utils/constants'
import { saveUserRating, getUserRating } from '@/services/ratingsService'
import AppHeader from '@/components/AppHeader.vue'

// Firestore imports for favorites
import { db } from '@/config/firebase'
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore'

const route = useRoute()
const moviesStore = useMoviesStore()
const authStore = useAuthStore()

const movie = computed(() => moviesStore.currentMovie)
const userRating = ref(null)
const hoveredStar = ref(0)
const isSavingRating = ref(false)
const saveSuccess = ref(false)
const saveError = ref(null)

// Favorite state
const isFavorite = ref(false)
const isSavingFavorite = ref(false)

function favDocRef(uid, movieId) {
  return doc(db, 'users', String(uid), 'favorites', String(movieId))
}

async function loadFavorite() {
  if (!authStore.user || !db || !movie.value) {
    isFavorite.value = false
    return
  }
  try {
    const ref = favDocRef(authStore.user.uid, movie.value.id)
    const snapshot = await getDoc(ref)
    isFavorite.value = snapshot.exists()
  } catch (e) {
    console.error('Error loading favorite state:', e)
    isFavorite.value = false
  }
}

async function toggleFavorite() {
  if (!authStore.user) {
    alert('Please sign in to save favorites.')
    return
  }
  if (!movie.value || !db) return

  if (isSavingFavorite.value) return
  isSavingFavorite.value = true
  const uid = authStore.user.uid
  const ref = favDocRef(uid, movie.value.id)

  try {
    if (isFavorite.value) {
      await deleteDoc(ref)
      isFavorite.value = false
    } else {
      await setDoc(ref, {
        id: movie.value.id,
        title: movie.value.title,
        poster_path: movie.value.poster_path || null,
        addedAt: serverTimestamp()
      })
      isFavorite.value = true
    }
  } catch (e) {
    console.error('Error toggling favorite:', e)
    alert('Could not update favorites. Try again.')
  } finally {
    isSavingFavorite.value = false
  }
}

const posterUrl = computed(() => {
  if (!movie.value?.poster_path) return '/placeholder-poster.jpg'
  return getImageUrl(movie.value.poster_path) || '/placeholder-poster.jpg'
})

// Calculate filled stars (TMDB rating is 0-10, we need 0-5)
const filledStars = computed(() => {
  if (!movie.value?.vote_average) return 0
  // Convert 0-10 scale to 0-5 scale and round
  return Math.round((movie.value.vote_average / 10) * 5)
})

const ratingText = computed(() => {
  if (!movie.value?.vote_average) return 'No rating'
  return `${movie.value.vote_average.toFixed(1)} / 10`
})

function handleImageError(event) {
  event.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
}

function resetHover() {
  hoveredStar.value = 0
}

async function setUserRating(rating) {
  if (!authStore.user || isSavingRating.value) return

  if (!movie.value || !movie.value.id) {
    console.warn('Movie not loaded yet')
    return
  }

  try {
    isSavingRating.value = true
    // Use numeric movie id to keep consistent doc ids
    const movieId = parseInt(movie.value.id)
    // Optimistic UI update
    userRating.value = rating
    hoveredStar.value = 0
    await saveUserRating(authStore.user.uid, movieId, rating)
    // show brief success indicator
    saveSuccess.value = true
    saveError.value = null
    setTimeout(() => (saveSuccess.value = false), 1500)
  } catch (error) {
    console.error('Error saving rating:', error)
    // expose error to UI to help debugging (display message)
    saveError.value = error?.message || String(error)
    // revert optimistic update
    await loadUserRating()
  } finally {
    isSavingRating.value = false
  }
}

async function loadUserRating() {
  if (!authStore.user || !movie.value || !movie.value.id) {
    userRating.value = null
    return
  }

  try {
    const movieId = parseInt(movie.value.id)
    const rating = await getUserRating(authStore.user.uid, movieId)
    userRating.value = rating
  } catch (error) {
    console.error('Error loading user rating:', error)
  }
}

onMounted(async () => {
  const movieId = route.params.id
  if (movieId && (!movie.value || movie.value.id !== parseInt(movieId))) {
    try {
      await moviesStore.fetchMovieDetails(movieId)
    } catch (error) {
      console.error('Error fetching movie details:', error)
    }
  }
  
  // Load user rating if user is logged in
  if (authStore.user) {
    await loadUserRating()
  }

  // Load favorite state
  await loadFavorite()
})

// Watch for movie changes and load rating
watch(() => movie.value, async (newMovie) => {
  if (newMovie && authStore.user) {
    await loadUserRating()
  }
  // load favorite whenever the movie changes
  await loadFavorite()
})

// Watch for auth changes
watch(() => authStore.user, async (newUser) => {
  if (newUser && movie.value) {
    await loadUserRating()
  await loadFavorite()
  } else {
    userRating.value = null
  isFavorite.value = false
  }
})
</script>

<style scoped>
.movie-details-view {
  min-height: 100vh;
  background: #000;
}

.main-content {
  padding-top: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  color: #fff;
}

.error-container {
  color: #e50914;
}

.movie-details-container {
  padding: 2rem 0;
}

.movie-content {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.poster-section {
  flex-shrink: 0;
  width: 300px;
}

.movie-poster {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  margin-bottom: 1.5rem;
}

/* Favorite button styles: hidden by default, visible on poster hover */
.fav-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  padding: 6px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.02);
  color: rgba(255,255,255,0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;                 /* hidden by default */
  transform: scale(0.94);
  transition: opacity 180ms ease, transform 160ms ease, background 120ms ease, color 120ms ease;
  pointer-events: none;       /* prevent interaction when invisible */
}

.poster-section:hover .fav-button {
  opacity: 0.55;
  pointer-events: auto;
}

.fav-button:hover {
  opacity: 1;
  transform: scale(1.06);
  background: rgba(255,255,255,0.06);
}

.fav-button.active {
  color: #ff6b81; /* pink/red for favorited */
  opacity: 1;
  background: rgba(255,107,129,0.08);
  box-shadow: 0 6px 14px rgba(0,0,0,0.35);
}

.heart-icon {
  width: 22px;
  height: 22px;
  display: block;
}
.heart-icon path {
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.rating-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.user-rating {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.rating-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stars {
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
}

.stars.interactive {
  cursor: pointer;
}

.star {
  color: #444;
  transition: color 0.2s, transform 0.2s;
  user-select: none;
}

.star.filled {
  color: #ffd700;
}

.star.interactive-star {
  cursor: pointer;
}

.star.interactive-star:hover {
  transform: scale(1.2);
}

.star.interactive-star.hover {
  color: #ffed4e;
}

.rating-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.rating-text.hint {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  font-style: italic;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.login-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin: 0;
}

.info-section {
  flex: 1;
  color: #fff;
}

.movie-title {
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  color: #fff;
}

.movie-synopsis {
  margin-top: 2rem;
}

.movie-synopsis h2 {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #fff;
}

.movie-synopsis p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
    gap: 2rem;
  }

  .poster-section {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .movie-title {
    font-size: 2rem;
    text-align: center;
  }

  .movie-synopsis {
    text-align: center;
  }

  .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>

