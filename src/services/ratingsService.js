import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
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
    const id = `${userId}_${parseInt(movieId)}`
    const ratingRef = doc(db, 'ratings', id)
    await setDoc(ratingRef, {
      userId,
      movieId: parseInt(movieId),
      rating: parseInt(rating),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id }
  } catch (error) {
    console.error('Error saving rating:', error)
    // rethrow so callers can inspect the error message/code
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
    const id = `${userId}_${parseInt(movieId)}`
    const ratingRef = doc(db, 'ratings', id)
    const ratingSnap = await getDoc(ratingRef)

    if (ratingSnap.exists()) {
      const data = ratingSnap.data()
      return data.rating ?? null
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




