import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '@/config/firebase'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Initialize auth state listener only if Firebase is configured
  if (auth) {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
    })
  }

  // Actions
  async function login(email, password) {
    if (!auth) {
      error.value = 'Firebase is not configured'
      throw new Error('Firebase is not configured')
    }
    try {
      loading.value = true
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return userCredential.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(email, password) {
    if (!auth) {
      error.value = 'Firebase is not configured'
      throw new Error('Firebase is not configured')
    }
    try {
      loading.value = true
      error.value = null
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return userCredential.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    if (!auth) {
      return
    }
    try {
      loading.value = true
      error.value = null
      await signOut(auth)
      user.value = null
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    loading,
    error,
    // Actions
    login,
    register,
    logout
  }
})

