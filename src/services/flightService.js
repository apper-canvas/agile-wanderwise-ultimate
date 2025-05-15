/**
 * Flight search service to handle flight search functionality
 */

// Mock airport data for realistic results
const airports = {
  'New York': 'NYC',
  'Los Angeles': 'LAX',
  'Chicago': 'ORD',
  'San Francisco': 'SFO',
  'Miami': 'MIA',
  'London': 'LHR',
  'Paris': 'CDG',
  'Tokyo': 'HND',
  'Sydney': 'SYD',
  'Dubai': 'DXB',
  'Beijing': 'PEK',
  'Mumbai': 'BOM',
  'Toronto': 'YYZ',
  'Berlin': 'BER'
};

// Mock airline data
const airlines = [
  "SkyWings Airlines",
  "Horizon Air",
  "Global Express",
  "Azure Airways",
  "Celestial Airlines",
  "Velocity Air",
  "Meridian Flights",
  "Pacific Wings",
  "Atlantic Airways",
  "Voyager Airlines"
];

/**
 * Book a flight with passenger details
 * @param {Object} flightData - Flight information
 * @param {Object} passengerDetails - Passenger information
 * @returns {Promise<Object>} - Booking confirmation
 */
export function bookFlight(flightData, passengerDetails) {
  // Simulate API call with a delay  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a booking reference
      const bookingReference = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      resolve({
        success: true,
        bookingReference,
        message: 'Booking confirmed successfully'
      });
    }, 1500);
  });
}

/**
 * Search for flights based on search criteria
 * @param {Object} searchParams - Search parameters (origin, destination, departDate, returnDate, passengers, tripType)
 * @returns {Promise<Object>} - Search results
 */
export function searchFlights(searchParams) {
  // Simulate API call with a delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Generate mock flight data based on search parameters
        const flights = generateFlights(searchParams);
        resolve({
          origin: searchParams.origin,
          destination: searchParams.destination,
          departDate: searchParams.departDate,
          returnDate: searchParams.returnDate,
          passengers: searchParams.passengers,
          flights
        });
      } catch (error) {
        reject(error);
      }
    }, 1500); // 1.5 second delay to simulate network request
  });
}

/**
 * Generate mock flight data
 * @param {Object} params - Search parameters
 * @returns {Array} - Array of flight objects
 */
function generateFlights(params) {
  const numFlights = Math.floor(Math.random() * 8) + 3; // Generate 3-10 flights
  const flights = [];
  
  for (let i = 0; i < numFlights; i++) {
    // Generate random departure time between 6am and 11pm
    const departHour = Math.floor(Math.random() * 17) + 6;
    const departMin = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    
    // Generate flight duration between 1-12 hours
    const durationHours = Math.floor(Math.random() * 12) + 1;
    const durationMins = Math.floor(Math.random() * 4) * 15;
    
    // Format times
    const departureTime = `${departHour.toString().padStart(2, '0')}:${departMin.toString().padStart(2, '0')}`;
    const arrivalHour = (departHour + durationHours) % 24;
    const arrivalMin = (departMin + durationMins) % 60;
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
    
    flights.push({
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flightNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000) + 1000}`,
      departureTime,
      arrivalTime,
      duration: `${durationHours}h ${durationMins}m`,
      price: Math.floor(Math.random() * 700) + 100, // $100-$800
      stops: Math.random() > 0.7 ? 1 : 0, // 30% chance of having 1 stop
      available: Math.floor(Math.random() * params.passengers * 5) + params.passengers // Ensure enough seats
    });
  }
  
  // Sort by price
  return flights.sort((a, b) => a.price - b.price);
}

// Also export as default object for backward compatibility
export default {
  searchFlights,
  bookFlight
};
