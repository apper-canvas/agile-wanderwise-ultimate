import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import DestinationCard from '../components/DestinationCard';
import { destinationsData } from '../data/destinationsData';

// Icons
const SearchIcon = getIcon('Search');
const FilterIcon = getIcon('SlidersHorizontal');
const GlobeIcon = getIcon('Globe');
const PlusIcon = getIcon('Plus');

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simulate loading data from an API
    const fetchDestinations = async () => {
      try {
        // In a real app, this would be an API call
        setDestinations(destinationsData);
        setFilteredDestinations(destinationsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        toast.error('Failed to load destinations. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    // Filter destinations based on search query and active filter
    const filteredResults = destinations.filter((destination) => {
      const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           destination.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === 'all') return matchesSearch;
      return matchesSearch && destination.continent === activeFilter;
    });
    
    setFilteredDestinations(filteredResults);
  }, [searchQuery, activeFilter, destinations]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-2"
        >
          Explore Destinations
        </motion.h1>
        <p className="text-surface-600 dark:text-surface-300 text-center max-w-2xl mx-auto">
          Discover amazing places around the world, from popular cities to hidden gems.
        </p>
      </div>
      
      {/* Add New Destination Button */}
      <div className="flex justify-end mb-6">
        <Link
          to="/destinations/add"
          className="btn-primary gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Add New Destination
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {['all', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? Array(8).fill(0).map((_, index) => <div key={index} className="bg-surface-200 dark:bg-surface-700 h-80 rounded-xl animate-pulse"></div>) : 
         filteredDestinations.length > 0 ? filteredDestinations.map(destination => <DestinationCard key={destination.id} destination={destination} />) : 
         <div className="col-span-full text-center py-12"><GlobeIcon className="w-12 h-12 mx-auto mb-4 text-surface-400" /><p>No destinations found. Try adjusting your search.</p></div>}
      </div>
    </div>
  );
};

export default Destinations;