/**
 * Service for trip plan-related operations using ApperClient
 */

/**
 * Fetch all trip plans for the current user
 * @returns {Promise<Array>} Array of trip plans
 */
export async function fetchTripPlans() {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('trip_plan1');
    return response.data || [];
  } catch (error) {
    console.error("Error fetching trip plans:", error);
    throw error;
  }
}

/**
 * Create a new trip plan
 * @param {Object} tripPlanData - Trip plan data to create
 * @returns {Promise<Object>} Created trip plan
 */
export async function createTripPlan(tripPlanData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Add current timestamp if not provided
    if (!tripPlanData.created_at) {
      tripPlanData.created_at = new Date().toISOString();
    }

    const response = await apperClient.createRecord('trip_plan1', {
      records: [tripPlanData]
    });

    if (response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error(response.message || 'Failed to create trip plan');
    }
  } catch (error) {
    console.error("Error creating trip plan:", error);
    throw error;
  }
}

export default {
  fetchTripPlans,
  createTripPlan
};