/**
 * Utility functions for handling offline functionality
 */

// Check if the user is currently online
export const isOnline = () => {
  return navigator.onLine;
};

// Subscribe to online/offline events
export const subscribeToNetworkChanges = (onlineCallback, offlineCallback) => {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
};

// Get current network status information
export const getNetworkStatus = () => {
  return {
    online: navigator.onLine,
    effectiveType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
    downlink: navigator.connection ? navigator.connection.downlink : 0,
  };
};

// Estimate if an asset is too large for offline storage based on connection
export const shouldCacheAsset = (assetSizeInKB) => {
  if (!navigator.onLine) return false;
  
  const connection = navigator.connection;
  if (!connection) return true;
  
  // For slow connections, only cache smaller assets
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return assetSizeInKB < 500; // Less than 500KB for slow connections
  }
  
  return true; // Cache everything on faster connections
};