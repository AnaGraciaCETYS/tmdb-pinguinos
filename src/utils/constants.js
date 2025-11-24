/**
 * Application constants
 */

// TMDB Image Base URLs
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
export const TMDB_POSTER_SIZE = 'w500'
export const TMDB_BACKDROP_SIZE = 'w1280'
export const TMDB_PROFILE_SIZE = 'w185'

/**
 * Get full image URL for TMDB images
 * @param {string} path - Image path from TMDB
 * @param {string} size - Image size (default: poster)
 * @returns {string} Full image URL
 */
export function getImageUrl(path, size = TMDB_POSTER_SIZE) {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

/**
 * Format movie duration from minutes to hours and minutes
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "2h 30m")
 */
export function formatDuration(minutes) {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

/**
 * Format date to readable string
 * @param {string} dateString - Date string
 * @returns {string} Formatted date (e.g., "January 1, 2024")
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

