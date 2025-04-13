import { FirestoreApi } from './api';
import { auth } from '../firebase';

/**
 * Service for managing user profiles in Firestore
 */
class UserService {
  constructor() {
    this.api = new FirestoreApi('users');
  }

  /**
   * Get the current authenticated user
   * @returns {User|null} - Firebase Auth user or null if not authenticated
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Get a user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} - User profile or null if not found
   */
  async getUserProfile(userId) {
    return this.api.getById(userId);
  }

  /**
   * Get the current user's profile
   * @returns {Promise<Object|null>} - Current user profile or null if not authenticated
   */
  async getCurrentUserProfile() {
    const user = this.getCurrentUser();
    if (!user) return null;
    return this.getUserProfile(user.uid);
  }

  /**
   * Create or update a user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} - Updated user profile
   */
  async setUserProfile(userId, profileData) {
    const existingProfile = await this.getUserProfile(userId);
    
    if (existingProfile) {
      return this.api.update(userId, profileData);
    } else {
      // For users, we want to use their auth UID as the document ID
      // This requires a different approach than the standard create method
      const docRef = this.api.getDocRef(userId);
      await this.api.update(userId, {
        ...profileData,
        id: userId // Ensure ID is set
      }, { 
        addTimestamp: true 
      });
      
      return this.getUserProfile(userId);
    }
  }

  /**
   * Update the current user's profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object|null>} - Updated profile or null if not authenticated
   */
  async updateCurrentUserProfile(profileData) {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    return this.setUserProfile(user.uid, profileData);
  }

  /**
   * Get users by role
   * @param {string} role - User role to filter by
   * @returns {Promise<Array>} - Array of user profiles
   */
  async getUsersByRole(role) {
    const filters = [
      { field: 'role', operator: '==', value: role }
    ];
    
    return this.api.query(filters);
  }
  
  /**
   * Update a user's activities or stats
   * @param {string} userId - User ID
   * @param {Object} stats - Stats to update
   * @returns {Promise<Object>} - Updated user profile
   */
  async updateUserStats(userId, stats) {
    const profile = await this.getUserProfile(userId);
    if (!profile) throw new Error('User profile not found');
    
    // Merge existing stats with new stats
    const currentStats = profile.stats || {};
    const updatedStats = {
      ...currentStats,
      ...stats,
      lastUpdated: new Date()
    };
    
    return this.api.update(userId, { stats: updatedStats });
  }
}

// Export a singleton instance
const userService = new UserService();
export default userService; 