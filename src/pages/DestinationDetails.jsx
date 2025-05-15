import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { destinationsData } from '../data/destinationsData';

// Icons
const StarIcon = getIcon('Star');
const BookmarkIcon = getIcon('Bookmark');
const BookmarkFilledIcon = getIcon('BookmarkCheck');
const MapPinIcon = getIcon('MapPin');
const CalendarIcon = getIcon('Calendar');
const ThermometerIcon = getIcon('Thermometer');
const LanguageIcon = getIcon('Globe');
const CurrencyIcon = getIcon('BadgeDollarSign');
const ChevronLeftIcon = getIcon('ChevronLeft');
const HeartIcon = getIcon('Heart');
const ClockIcon = getIcon('Clock');

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call to fetch details by ID
    const fetchDestinationDetails = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundDestination = destinationsData.find(dest => dest.id.toString() === id.toString());
        
        if (!foundDestination) {
          setError('Destination not found');
          toast.error('Destination not found');
        } else {
          setDestination(foundDestination);
        }
      } catch (error) {
        console.error('Error fetching destination details:', error);
        setError('Failed to load destination details');
        toast.error('Failed to load destination details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationDetails();
  }, [id]);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    
    if (!isSaved) {
      toast.success(`${destination.name} added to saved destinations!`);
    } else {
      toast.info(`${destination.name} removed from saved destinations.`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mx-auto"></div>
            <div className="h-96 bg-surface-200 dark:bg-surface-700 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Destination Not Found</h2>
          <p className="mb-6 text-surface-600 dark:text-surface-300">
            Sorry, we couldn't find the destination you're looking for.
          </p>
          <button 
            onClick={() => navigate('/destinations')}
            className="btn-primary"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/destinations')}
        className="mb-6 flex items-center text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-1" />
        Back to Destinations
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Hero section */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <img 
            src={destination.imageUrl} 
            alt={destination.name}
            className="w-full h-[50vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
                <div className="flex items-center gap-2 mb-1">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{destination.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">{destination.rating}</span>
                  <span className="text-surface-200">({destination.reviewCount} reviews)</span>
                </div>
              </div>
              <button
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-colors"
                onClick={handleSaveToggle}
                aria-label={isSaved ? "Remove from saved" : "Save destination"}
              >
                {isSaved ? (
                  <BookmarkFilledIcon className="w-6 h-6 text-primary-light" />
                ) : (
                  <BookmarkIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Description and details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
            <p className="text-surface-700 dark:text-surface-300 mb-6 leading-relaxed">
              {destination.description}
            </p>
            
            {/* More detailed description would go here */}
            <p className="text-surface-700 dark:text-surface-300 mb-6 leading-relaxed">
              {destination.name} offers travelers a unique blend of cultural experiences, natural beauty, and unforgettable adventures. Whether you're exploring historic landmarks, savoring local cuisine, or simply relaxing in scenic surroundings, this destination has something for everyone.
            </p>
            
            {/* Attractions Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Top Attractions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Famous Landmark', 'Natural Wonder', 'Historic Site', 'Local Market'].map((attraction, index) => (
                  <div key={index} className="card p-4 flex items-start gap-3">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <HeartIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">{attraction}</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">A must-visit spot in {destination.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar with practical information */}
          <div>
            <div className="card mb-6">
              <h3 className="text-lg font-bold mb-4">Practical Information</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Best Time to Visit</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">March to May, September to November</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <ThermometerIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Climate</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">Temperate, with warm summers</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <LanguageIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">English, Local Language</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <CurrencyIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">Local Currency (LC)</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Suggested Duration</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">3-5 days</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;