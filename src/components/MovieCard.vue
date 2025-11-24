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
    </div>
    
    <!-- Movie Info -->
    <div class="movie-details">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p v-if="movie.overview" class="movie-overview">{{ truncatedOverview }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/utils/constants'

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

