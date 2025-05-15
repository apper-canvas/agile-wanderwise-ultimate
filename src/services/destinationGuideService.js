/**
 * Service for destination guide-related operations using ApperClient
 */

/**
 * Fetch all destination guides with optional filters
 * @param {Object} filters - Optional filters to apply
 * @returns {Promise<Array>} Array of destination guides
 */
export async function fetchDestinationGuides(filters = {}) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      where: []
    };

    // Add search query filter
    if (filters.searchQuery) {
      params.whereGroups = [{
        operator: "OR",
        subGroups: [
          {
            conditions: [
              {
                fieldName: "destination",
                operator: "Contains",
                values: [filters.searchQuery]
              }
            ]
          },
          {
            conditions: [
              {
                fieldName: "country",
                operator: "Contains",
                values: [filters.searchQuery]
              }
            ]
          }
        ]
      }];
    }

    // Add offline filter
    if (filters.offlineOnly) {
      params.where.push({
        fieldName: "is_offline",
        operator: "ExactMatch",
        values: [true]
      });
    }

    const response = await apperClient.fetchRecords('destination_guide1', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching destination guides:", error);
    throw error;
  }
}

/**
 * Fetch a specific destination guide by ID
 * @param {string|number} id - Destination guide ID
 * @returns {Promise<Object>} Destination guide details
 */
export async function fetchDestinationGuideById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('destination_guide1', id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching destination guide with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update destination guide offline status
 * @param {string|number} id - Destination guide ID
 * @param {boolean} isOffline - Whether the guide should be available offline
 * @returns {Promise<Object>} Updated destination guide
 */
export async function updateGuideOfflineStatus(id, isOffline) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.updateRecord('destination_guide1', {
      records: [{ Id: id, is_offline: isOffline }]
    });

    if (response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error(response.message || 'Failed to update offline status');
    }
  } catch (error) {
    console.error(`Error updating guide offline status for ID ${id}:`, error);
    throw error;
  }
}

export default {
  fetchDestinationGuides,
  fetchDestinationGuideById,
  updateGuideOfflineStatus
};