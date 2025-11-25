<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <h1>PinguinFlix</h1>
      </router-link>

      <!-- Navigation -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/search" class="nav-link">Search</router-link>
      </nav>

      <!-- Search Bar (in header) -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          @keyup.enter="navigateToSearch"
          type="text"
          placeholder="Search movies..."
          class="search-input"
        />
        <button @click="navigateToSearch" class="search-button" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      <!-- Auth Section -->
      <div class="auth-section">
        <router-link v-if="!authStore.user" to="/signin" class="auth-button login">
          Sign In
        </router-link>
        <div v-else class="user-menu">
          <span class="user-email">{{ authStore.user.email }}</span>
          <button @click="handleLogout" class="auth-button logout">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')

function handleSearch() {
  // Real-time search could be implemented here
}

function navigateToSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value } })
  } else {
    router.push({ name: 'search' })
  }
}

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 0;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  text-decoration: none;
  color: #e50914;
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #e50914;
}

.nav-link.router-link-active {
  color: #e50914;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e50914;
}

.search-container {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  flex: 1;
  max-width: 400px;
  transition: background 0.3s;
}

.search-container:focus-within {
  background: rgba(255, 255, 255, 0.15);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  padding: 0.25rem 0;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-button {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.search-button:hover {
  color: #e50914;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-button {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.auth-button.login {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.auth-button.login:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.auth-button.logout {
  background: #e50914;
  color: #fff;
}

.auth-button.logout:hover {
  background: #f40612;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-email {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    padding: 0 1rem;
    gap: 1rem;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .search-container {
    order: 2;
    max-width: 100%;
    flex: 1 1 100%;
  }

  .user-email {
    display: none;
  }
}
</style>

