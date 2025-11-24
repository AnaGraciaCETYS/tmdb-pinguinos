<template>
  <div class="not-found-view">
    <AppHeader />
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/" class="home-link">Go back home</router-link>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.not-found-view {
  min-height: 100vh;
  background: #000;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  text-align: center;
  padding: 2rem;
}

.not-found-content h1 {
  font-size: 8rem;
  font-weight: 700;
  color: #e50914;
  margin: 0;
  line-height: 1;
}

.not-found-content h2 {
  font-size: 2rem;
  color: #fff;
  margin: 1rem 0;
}

.not-found-content p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2rem 0;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #e50914;
  color: #fff;
  border-radius: 4px;
  font-weight: 600;
  transition: background 0.3s;
}

.home-link:hover {
  background: #f40612;
}

@media (max-width: 768px) {
  .not-found-content h1 {
    font-size: 5rem;
  }

  .not-found-content h2 {
    font-size: 1.5rem;
  }

  .not-found-content p {
    font-size: 1rem;
  }
}
</style>

