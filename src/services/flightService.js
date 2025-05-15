/**
 * Service for flight booking operations using ApperClient
 */

/**
 * Search for flights based on search criteria
 * @param {Object} searchParams - Search parameters (origin, destination, departDate, returnDate, passengers)
 * @returns {Promise<Object>} - Flight search results
 */
export async function searchFlights(searchParams) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Create filters based on search parameters
    const params = {
      where: []
    };

    if (searchParams.origin) {
      params.where.push({
        fieldName: "origin",
        operator: "ExactMatch",
        values: [searchParams.origin]
      });
    }

    if (searchParams.destination) {
      params.where.push({
        fieldName: "destination",
        operator: "ExactMatch",
        values: [searchParams.destination]
      });
    }

    const response = await apperClient.fetchRecords('flight_booking1', params);
    return {
      origin: searchParams.origin,
      destination: searchParams.destination,
      departDate: searchParams.departDate,
      returnDate: searchParams.returnDate,
      passengers: searchParams.passengers,
      flights: response.data || []
    };
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
}

/**
 * Book a flight
 * @param {Object} bookingData - Flight booking data
 * @returns {Promise<Object>} - Booking confirmation
 */
export async function bookFlight(bookingData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Generate a booking reference if not provided
    if (!bookingData.booking_reference) {
      bookingData.booking_reference = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    const response = await apperClient.createRecord('flight_booking1', {
      records: [bookingData]
    });

    if (response.success && response.results && response.results.length > 0) {
      return {
        success: true,
        bookingReference: response.results[0].data.booking_reference,
        message: 'Booking confirmed successfully',
        booking: response.results[0].data
      };
    } else {
      throw new Error(response.message || 'Failed to book flight');
    }
  } catch (error) {
    console.error("Error booking flight:", error);
    throw error;
  }
}

export default {
  searchFlights,
  bookFlight
};