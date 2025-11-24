import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@/config/firebase'

/**
 * Save user rating for a movie
 * @param {string} userId - User ID
 * @param {number} movieId - Movie ID
 * @param {number} rating - Rating (1-5)
 * @returns {Promise} Promise that resolves when rating is saved
 */
export async function saveUserRating(userId, movieId, rating) {
  if (!db) {
    throw new Error('Firebase is not configured')
  }

  try {
    const ratingRef = doc(db, 'ratings', `${userId}_${movieId}`)
    await setDoc(ratingRef, {
      userId,
      movieId: parseInt(movieId),
      rating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return { success: true }
  } catch (error) {
    console.error('Error saving rating:', error)
    throw error
  }
}

/**
 * Get user rating for a movie
 * @param {string} userId - User ID
 * @param {number} movieId - Movie ID
 * @returns {Promise<number|null>} User rating (1-5) or null if not rated
 */
export async function getUserRating(userId, movieId) {
  if (!db) {
    return null
  }

  try {
    const ratingRef = doc(db, 'ratings', `${userId}_${movieId}`)
    const ratingSnap = await getDoc(ratingRef)
    
    if (ratingSnap.exists()) {
      return ratingSnap.data().rating
    }
    return null
  } catch (error) {
    console.error('Error getting rating:', error)
    return null
  }
}

/**
 * Get average rating for a movie from all users
 * @param {number} movieId - Movie ID
 * @returns {Promise<{average: number, count: number}>} Average rating and count
 */
export async function getMovieAverageRating(movieId) {
  if (!db) {
    return { average: 0, count: 0 }
  }

  try {
    const ratingsRef = collection(db, 'ratings')
    const q = query(ratingsRef, where('movieId', '==', parseInt(movieId)))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return { average: 0, count: 0 }
    }

    let total = 0
    let count = 0
    
    querySnapshot.forEach((doc) => {
      total += doc.data().rating
      count++
    })

    return {
      average: total / count,
      count
    }
  } catch (error) {
    console.error('Error getting average rating:', error)
    return { average: 0, count: 0 }
  }
}




