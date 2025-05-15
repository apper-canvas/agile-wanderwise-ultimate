/**
 * Service for destination-related operations using ApperClient
 */

/**
 * Fetch destinations with optional filters
 * @param {Object} filters - Optional filters to apply 
 * @returns {Promise<Array>} Array of destinations
 */
export async function fetchDestinations(filters = {}) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      where: []
    };

    // Add continent filter if provided
    if (filters.continent && filters.continent !== 'all') {
      params.where.push({
        fieldName: "continent",
        operator: "ExactMatch",
        values: [filters.continent]
      });
    }

    // Add search query filter if provided
    if (filters.searchQuery) {
      params.whereGroups = [{
        operator: "OR",
        subGroups: [
          {
            conditions: [
              {
                fieldName: "Name",
                operator: "Contains",
                values: [filters.searchQuery]
              }
            ],
            operator: ""
          },
          {
            conditions: [
              {
                fieldName: "country",
                operator: "Contains",
                values: [filters.searchQuery]
              }
            ],
            operator: ""
          }
        ]
      }];
    }

    const response = await apperClient.fetchRecords('destination1', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw error;
  }
}

/**
 * Fetch a specific destination by ID
 * @param {string|number} id - Destination ID
 * @returns {Promise<Object>} Destination details
 */
export async function fetchDestinationById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('destination1', id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching destination with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new destination
 * @param {Object} destinationData - Destination data to create
 * @returns {Promise<Object>} Created destination
 */
export async function createDestination(destinationData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Format tags properly for Tag type field
    if (Array.isArray(destinationData.tags)) {
      destinationData.Tags = destinationData.tags;
      delete destinationData.tags;
    } else if (typeof destinationData.tags === 'string') {
      destinationData.Tags = destinationData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      delete destinationData.tags;
    }

    const response = await apperClient.createRecord('destination1', {
      records: [destinationData]
    });

    if (response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error(response.message || 'Failed to create destination');
    }
  } catch (error) {
    console.error("Error creating destination:", error);
    throw error;
  }
}

export default {
  fetchDestinations,
  fetchDestinationById,
  createDestination
};