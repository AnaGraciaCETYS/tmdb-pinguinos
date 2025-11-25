<template>
  <div class="movie-card" @click="navigateToDetails">
    <!-- Movie Poster -->
    <div class="poster-container">
        <img
          :src="posterUrl"
          :alt="movie.title"
          class="poster-image"
          @error="handleImageError"
        />

        <!-- Favorite heart button: appears when hovering the poster, fully visible on button hover -->
        <button
          class="card-fav-button"
          :class="{ active: isFavorite }"
          @click.stop="toggleFavorite"
          :aria-pressed="isFavorite"
          title="Add to favorites"
        >
          <svg viewBox="0 0 24 24" class="card-heart-icon" aria-hidden="true" focusable="false">
            <path
              d="M12.1 21s-7.4-4.35-9.2-6.2C-0.1 11.6 2.1 6 6.6 6c2.4 0 3.9 1.6 4.5 2.3C11.5 7.6 13 6 15.4 6 19.9 6 22.1 11.6 21.1 14.8c-1.8 1.85-9 6.2-9 6.2z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    
    <!-- Movie Info -->
    <div class="movie-details">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p v-if="movie.overview" class="movie-overview">{{ truncatedOverview }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/utils/constants'
import { auth, db } from '@/config/firebase'
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const posterUrl = computed(() => {
  return getImageUrl(props.movie.poster_path) || '/placeholder-poster.jpg'
})

// Favorite state for this card (uses Firestore when available and user signed in)
const isFavorite = ref(false)

const authStore = useAuthStore()

function favDocRef(uid, movieId) {
  return doc(db, 'users', String(uid), 'favorites', String(movieId))
}

async function loadFavorite() {
  // If user signed in and Firestore available, read from Firestore
  try {
    if (auth && auth.currentUser && db) {
      const ref = favDocRef(auth.currentUser.uid, props.movie.id)
      const snapshot = await getDoc(ref)
      isFavorite.value = snapshot.exists()
      return
    }

    // fallback: read from localStorage list
    const key = 'local_favs'
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    isFavorite.value = data.indexOf(String(props.movie.id)) > -1
  } catch (e) {
    // silently ignore but keep a deterministic boolean
    isFavorite.value = false
  }
}

let isToggling = false
async function toggleFavorite() {
  // prevent navigation
  if (!db || !auth || !auth.currentUser) {
    // user not signed in or firebase not configured -> toggle localStorage simple list
    const key = 'local_favs'
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]')
      const id = String(props.movie.id)
      const idx = data.indexOf(id)
      if (idx > -1) {
        data.splice(idx, 1)
        isFavorite.value = false
      } else {
        data.push(id)
        isFavorite.value = true
      }
      localStorage.setItem(key, JSON.stringify(data))

      // notify other components in this tab to refresh
      try { window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { id: props.movie.id } })) } catch(e){}
    } catch (e) {
      console.error('local fav toggle error', e)
    }
    return
  }

  if (isToggling) return
  isToggling = true
  try {
    const uid = auth.currentUser.uid
    const ref = favDocRef(uid, props.movie.id)
    if (isFavorite.value) {
      await deleteDoc(ref)
      isFavorite.value = false
    } else {
      await setDoc(ref, {
        id: props.movie.id,
        title: props.movie.title,
        poster_path: props.movie.poster_path || null,
        addedAt: serverTimestamp()
      })
      isFavorite.value = true
    }
  // notify other components in this tab to refresh (e.g., cards on home)
  try { window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { id: props.movie.id } })) } catch(e){}
  } catch (e) {
    console.error('toggleFavorite error', e)
  } finally {
    isToggling = false
  }
}

const truncatedOverview = computed(() => {
  if (!props.movie.overview) return 'No description available.'
  // Show brief description (first 120 characters)
  return props.movie.overview.length > 120
    ? props.movie.overview.substring(0, 120) + '...'
    : props.movie.overview
})

function navigateToDetails() {
  router.push({ name: 'movie-details', params: { id: props.movie.id } })
}

function handleImageError(event) {
  event.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
}

onMounted(() => {
  // Try to load favorite from Firestore when component mounts
  try {
    loadFavorite()
  } catch (e) {
    // ignore
  }
  // Listen for global favorites updates (other components may dispatch this)
  window.addEventListener('favorites-updated', loadFavorite)
  // Also react to auth state changes via auth store
  // If user signs in/out later, reload favorite state
  // watch will be registered below
})

onUnmounted(() => {
  window.removeEventListener('favorites-updated', loadFavorite)
})

// Reload favorite when auth state changes (user signs in or out)
watch(() => authStore.user, async () => {
  try { await loadFavorite() } catch(e) {}
})
</script>

<style scoped>
.movie-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  background: #1a1a1a;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.poster-container {
  width: 100%;
  padding-top: 150%; /* 2:3 aspect ratio for movie posters */
  overflow: hidden;
  background: #2a2a2a;
  position: relative;
}

/* Card favorite button styles */
.card-fav-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
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
  transform: scale(0.96);
  transition: opacity 180ms ease, transform 160ms ease, background 120ms ease, color 120ms ease;
  pointer-events: none;       /* prevent interaction when invisible */
}

.poster-container:hover .card-fav-button {
  opacity: 0.6;
  pointer-events: auto;
}

.card-fav-button:hover {
  opacity: 1;
  transform: scale(1.06);
  background: rgba(255,255,255,0.04);
}

.card-fav-button.active {
  color: #ff6b81;
  opacity: 1;
  background: rgba(255,107,129,0.08);
}

.card-heart-icon { width: 18px; height: 18px; display: block }
.card-heart-icon path { vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; fill: none }

.poster-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-details {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  margin: 0 0 0.5rem 0;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-overview {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

