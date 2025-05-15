import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { isOnline } from '../utils/offlineUtils';
import { fetchDestinationGuides, updateGuideOfflineStatus } from '../services/destinationGuideService';

// Icons

const DestinationGuides = () => {
  // State
  const [guides, setGuides] = useState([]);
  const [offlineGuides, setOfflineGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeGuide, setActiveGuide] = useState(null);
  const [showOfflineOnly, setShowOfflineOnly] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({ online: isOnline() });

  // Fetch destination guides
  useEffect(() => {
    async function fetchGuides() {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from an API here
        // Fetch guides from backend
        const params = {};
        if (showOfflineOnly) {
          params.offlineOnly = true;
        }
        const guidesData = await fetchDestinationGuides(params);
        
        setGuides(guidesData);
      } catch (error) {
        console.error('Error fetching guides:', error);
        toast.error('Failed to load destination guides');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGuides();

    // Setup network status listeners
    const handleOnline = () => {
      setNetworkStatus({ online: true });
      toast.success('You are back online!');
    };

    const handleOffline = () => {
      setNetworkStatus({ online: false });
      toast.warn('You are offline. Showing saved guides.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showOfflineOnly]);

  const MapIcon = getIcon('Map');
  // Filter guides based on search term and offline status
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          guide.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showOfflineOnly) {
      return matchesSearch && offlineGuides.some(og => og.id === guide.id);
    }
    
    return matchesSearch;
  });

  // Check if a guide is saved for offline
  const isGuideSavedOffline = (guideId) => {
    return guides.some(guide => guide.Id === guideId && guide.is_offline);
  };

  // Toggle offline guide
  const toggleOfflineGuide = async (guide) => {
    try {
      if (isGuideSavedOffline(guide.Id)) {
        await updateGuideOfflineStatus(guide.Id, false);
        toast.info(`${guide.destination} removed from offline guides`);
        setGuides(guides.map(g => g.Id === guide.Id ? { ...g, is_offline: false } : g));
      } else {
        await updateGuideOfflineStatus(guide.Id, true);
        toast.success(`${guide.destination} saved for offline access`);
        setGuides(guides.map(g => g.Id === guide.Id ? { ...g, is_offline: true } : g));
      }
    } catch (error) {
      console.error('Error toggling offline guide:', error);
      toast.error('Failed to update offline guides');
    }
  };
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-neu-dark overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Destination Guides</h3>
          
          <div className="flex items-center gap-3">
            {!networkStatus.online && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm">
                <WifiOffIcon className="w-4 h-4" />
                <span>Offline Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search destinations..."
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            const SearchIcon = getIcon('Search');
            <span className="absolute left-3 top-2.5 text-surface-500 dark:text-surface-400">
              <SearchIcon className="w-5 h-5" />
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowOfflineOnly(!showOfflineOnly)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                showOfflineOnly 
                  ? 'bg-primary text-white' 
              const DownloadIcon = getIcon('Download');
                  : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              <DownloadIcon className="w-4 h-4" />
              Offline Guides
            </button>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setShowOfflineOnly(false);
              }}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Reset filters"
            >
              const RefreshCwIcon = getIcon('RefreshCw');
              <RefreshCwIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guides grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-surface-200 dark:bg-surface-700 rounded-xl"></div>
            ))}
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full mb-4">
              
              <MapIcon className="w-8 h-8 text-surface-500" />
            </div>
            <h4 className="text-xl font-medium mb-2">No guides found</h4>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              {showOfflineOnly 
                ? "You haven't saved any guides for offline access yet." 
                : "No destinations match your search criteria. Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <div 
                key={guide.Id}
                className="relative border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                  const GlobeIcon = getIcon('Globe');
                  <GlobeIcon className="w-12 h-12 text-surface-400" />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold">{guide.destination || guide.Name}</h4>
                    <span className="text-sm text-surface-500 dark:text-surface-400">{guide.country}</span>
                  </div>
                  
                  <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setActiveGuide(guide)}
                      className="text-primary-dark dark:text-primary-light hover:underline text-sm flex items-center gap-1"
                    >
                      const InfoIcon = getIcon('Info');
                      <InfoIcon className="w-4 h-4" />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => toggleOfflineGuide(guide)}
                      className={`p-2 rounded-full ${
                        isGuideSavedOffline(guide.Id)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                      }`}
                      aria-label={isGuideSavedOffline(guide.Id) ? "Remove from offline guides" : "Save for offline"}
                    >
                      const TrashIcon = getIcon('Trash');
                      const DownloadIcon = getIcon('Download');
                      {isGuideSavedOffline(guide.Id) ? (
                        <TrashIcon className="w-4 h-4" />
                      ) : (
                        <DownloadIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {isGuideSavedOffline(guide.id) && (
                {isGuideSavedOffline(guide.Id) && (
                    <DownloadIcon className="w-3 h-3" />
                    const DownloadIcon = getIcon('Download');
                    Offline
                    Available Offline
                )}
              </div>
            ))}
          </div>
        )}

        {/* Offline information */}
        <div className="mt-8 p-4 border border-dashed border-surface-300 dark:border-surface-600 rounded-lg">
          <div className="flex gap-3">
            <div className="flex-shrink-0 text-primary dark:text-primary-light">
              const WifiOffIcon = getIcon('WifiOff');
              <WifiOffIcon className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-medium mb-1">Offline Access</h5>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Save guides for offline access by clicking the download icon. Saved guides will be available even without internet connection.
              </p>
              <div className="mt-3 text-sm">
                <span className="font-medium">Saved guides: </span>
                <span>{guides.filter(g => g.is_offline).length} of {guides.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationGuides;