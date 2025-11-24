<template>
  <section class="movie-row">
    <h2 class="row-title">{{ title }}</h2>
    <div class="movies-container" ref="containerRef">
      <div class="movies-scroll">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          class="movie-item"
        />
      </div>
      <button
        v-if="showScrollButtons"
        @click="scrollLeft"
        class="scroll-button scroll-left"
        aria-label="Scroll left"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button
        v-if="showScrollButtons"
        @click="scrollRight"
        class="scroll-button scroll-right"
        aria-label="Scroll right"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  movies: {
    type: Array,
    required: true,
    default: () => []
  }
})

const containerRef = ref(null)
const showScrollButtons = ref(false)

function checkScrollButtons() {
  if (containerRef.value) {
    const container = containerRef.value
    const scrollContainer = container.querySelector('.movies-scroll')
    if (scrollContainer) {
      showScrollButtons.value = scrollContainer.scrollWidth > scrollContainer.clientWidth
    }
  }
}

function scrollLeft() {
  if (containerRef.value) {
    const scrollContainer = containerRef.value.querySelector('.movies-scroll')
    scrollContainer.scrollBy({ left: -600, behavior: 'smooth' })
  }
}

function scrollRight() {
  if (containerRef.value) {
    const scrollContainer = containerRef.value.querySelector('.movies-scroll')
    scrollContainer.scrollBy({ left: 600, behavior: 'smooth' })
  }
}

onMounted(() => {
  checkScrollButtons()
  window.addEventListener('resize', checkScrollButtons)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScrollButtons)
})
</script>

<style scoped>
.movie-row {
  margin-bottom: 3rem;
}

.row-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding: 0 2rem;
}

.movies-container {
  position: relative;
  padding: 0 2rem;
}

.movies-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding-bottom: 0.5rem;
}

.movies-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.movie-item {
  flex: 0 0 200px;
  min-width: 200px;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.scroll-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.scroll-left {
  left: 0.5rem;
}

.scroll-right {
  right: 0.5rem;
}

@media (max-width: 768px) {
  .row-title {
    padding: 0 1rem;
    font-size: 1.25rem;
  }

  .movies-container {
    padding: 0 1rem;
  }

  .movie-item {
    flex: 0 0 150px;
    min-width: 150px;
  }

  .scroll-button {
    display: none;
  }
}
</style>

