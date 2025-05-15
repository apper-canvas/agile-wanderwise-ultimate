import { openDB } from 'idb';

const DB_NAME = 'wanderwiseDB';
const DB_VERSION = 1;
const GUIDES_STORE = 'destinationGuides';
const OFFLINE_GUIDES_STORE = 'offlineGuides';
const DESTINATIONS_STORE = 'destinations';
const TRIP_PLANS_STORE = 'tripPlans';

/**
 * Initialize the IndexedDB database with object stores for destination guides
 */
async function initDB() {
  try {
    return await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create a store for all destination guides
        if (!db.objectStoreNames.contains(GUIDES_STORE)) {
          const guideStore = db.createObjectStore(GUIDES_STORE, { keyPath: 'id' });
          guideStore.createIndex('destination', 'destination', { unique: false });
          guideStore.createIndex('country', 'country', { unique: false });
        }
        
        // Create a store for guides marked for offline access
        if (!db.objectStoreNames.contains(OFFLINE_GUIDES_STORE)) {
          const offlineStore = db.createObjectStore(OFFLINE_GUIDES_STORE, { keyPath: 'id' });
          offlineStore.createIndex('destination', 'destination', { unique: false });
        }
        
        // Create a store for destinations
        if (!db.objectStoreNames.contains(DESTINATIONS_STORE)) {
          const destinationsStore = db.createObjectStore(DESTINATIONS_STORE, { keyPath: 'id', autoIncrement: true });
          destinationsStore.createIndex('name', 'name', { unique: true });
        }
        
        // Create a store for trip plans
        if (!db.objectStoreNames.contains(TRIP_PLANS_STORE)) {
          const tripPlansStore = db.createObjectStore(TRIP_PLANS_STORE, { keyPath: 'id', autoIncrement: true });
          tripPlansStore.createIndex('tripName', 'tripName', { unique: false });
        }
      }
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Save a destination to the database
 * @param {Object} destination - The destination object to save
 */
export async function saveDestination(destination) {
  try {
    const db = await initDB();
    // If no ID is provided, one will be auto-generated
    const id = await db.add(DESTINATIONS_STORE, destination);
    return { success: true, id };
  } catch (error) {
    console.error('Error saving destination:', error);
    return { success: false, error: error.message };
  }
}


/**
 * Save a destination guide to the database
 * @param {Object} guide - The guide object to save
 */
export async function saveGuide(guide) {
  try {
    const db = await initDB();
    await db.put(GUIDES_STORE, guide);
    return true;
  } catch (error) {
    console.error('Error saving guide:', error);
    return false;
  }
}

/**
 * Get all destination guides from the database
 */
export async function getAllGuides() {
  try {
    const db = await initDB();
    return await db.getAll(GUIDES_STORE);
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
}

/**
 * Get a specific destination guide by ID
 * @param {string} id - The guide ID
 */
export async function getGuideById(id) {
  try {
    const db = await initDB();
    return await db.get(GUIDES_STORE, id);
  } catch (error) {
    console.error('Error fetching guide:', error);
    return null;
  }
}

/**
 * Mark a destination guide for offline access
 * @param {Object} guide - The guide to mark for offline access
 */
export async function saveGuideForOffline(guide) {
  try {
    // First make sure it's in the main guides store
    const db = await initDB();
    await db.put(GUIDES_STORE, guide);
    
    // Then mark it for offline access
    await db.put(OFFLINE_GUIDES_STORE, {
      ...guide,
      offlineSavedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error saving guide for offline access:', error);
    return false;
  }
}

/**
 * Get all guides marked for offline access
    throw error;
export async function getOfflineGuides() {
  try {
    const db = await initDB();
    return await db.getAll(OFFLINE_GUIDES_STORE);
  } catch (error) {
    console.error('Error fetching offline guides:', error);
    return [];
  }
}

/**
 * Remove a guide from offline access
 * @param {string} id - The guide ID to remove from offline access
 */
export async function removeGuideFromOffline(id) {
  try {
    const db = await initDB();
    await db.delete(OFFLINE_GUIDES_STORE, id);
    return true;
  } catch (error) {
    console.error('Error removing guide from offline access:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save a trip plan to the database
 * @param {Object} tripPlan - The trip plan object to save
 * @returns {Promise<Object>} - Result of the save operation
 */
export async function saveTripPlan(tripPlan) {
  try {
    const db = await initDB();
    // If no ID is provided, one will be auto-generated
    const id = await db.add(TRIP_PLANS_STORE, {
      ...tripPlan,
      createdAt: new Date().toISOString()
    });
    return { success: true, id };
  } catch (error) {
    console.error('Error saving trip plan:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all trip plans from the database
 * @returns {Promise<Array>} - Array of trip plans
 */
export async function getAllTripPlans() {
  try {
    const db = await initDB();
    return await db.getAll(TRIP_PLANS_STORE);
  } catch (error) {
    console.error('Error fetching trip plans:', error);
    return [];
  }
}

/**
 * Get a specific trip plan by ID
 * @param {number|string} id - The trip plan ID
 * @returns {Promise<Object|null>} - The trip plan or null if not found
 */
export async function getTripPlanById(id) {
  try {
    const db = await initDB();
    return await db.get(TRIP_PLANS_STORE, id);
  } catch (error) {
    console.error('Error fetching trip plan:', error);
    return null;
  }
}

export default { 
  initDB, 
  saveGuide, 
  getAllGuides, 
  getGuideById, 
  saveGuideForOffline, 
  getOfflineGuides, 
  removeGuideFromOffline, 
  saveDestination,
  saveTripPlan,
  getAllTripPlans,
  getTripPlanById
};