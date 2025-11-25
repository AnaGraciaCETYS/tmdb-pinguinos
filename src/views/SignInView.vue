<template>
  <div class="page-wrap">
    <div class="sign-card">
      <div class="card-header">
        <h2>PinguinFlix</h2>
        <p class="subtitle">Sign in to access your favorites and ratings</p>
      </div>

      <form class="form" @submit.prevent="onLogin">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email" />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required minlength="6" autocomplete="current-password" />
        </div>

        <div class="actions">
          <button class="btn btn-ghost" type="submit" :disabled="authStore.loading">Sign In</button>
          <button class="btn btn-primary" type="button" @click="onRegister" :disabled="authStore.loading">Register</button>
        </div>
      </form>

      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>

      <router-link class="back-link" to="/">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function onLogin() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    // error is handled in the store and shown via authStore.error
    console.error('Login failed', err)
  }
}

async function onRegister() {
  try {
    await authStore.register(email.value, password.value)
    router.push('/')
  } catch (err) {
    console.error('Register failed', err)
  }
}
</script>

<style scoped>
.page-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 3rem 1.5rem;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 60%);
}
.sign-card {
  width: 100%;
  max-width: 520px;
  padding: 2rem;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  color: var(--color-text);
}
.card-header h2 {
  margin: 0 0 0.25rem 0;
  color: var(--color-heading);
}
.subtitle {
  margin: 0 0 1.25rem 0;
  color: rgba(235,235,235,0.6);
  font-size: 0.95rem;
}
.form {
  display: grid;
  gap: 0.75rem;
}
.field label {
  display: block;
  font-size: 0.9rem;
  color: rgba(235,235,235,0.8);
}
.field input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  margin-top: 0.35rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field input:focus {
  border-color: var(--color-border-hover);
  box-shadow: 0 4px 18px rgba(0,0,0,0.4);
}
.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.btn {
  flex: 1;
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.08s ease, opacity 0.12s ease;
}
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--color-text);
}
.btn-primary {
  background: #e50914;
  color: #fff;
  border: 1px solid rgba(0,0,0,0.2);
}
.error {
  color: #ff6b6b;
  margin-top: 1rem;
}
.back-link {
  display: inline-block;
  margin-top: 1.25rem;
  color: rgba(235,235,235,0.75);
}

@media (max-width: 640px) {
  .sign-card { padding: 1.25rem; }
  .page-wrap { padding: 2rem 1rem; }
}
</style>
