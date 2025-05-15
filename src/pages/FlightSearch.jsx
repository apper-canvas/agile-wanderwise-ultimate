import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Icon declarations
const PlaneLandingIcon = getIcon('PlaneLanding');
const PlaneTakeoffIcon = getIcon('PlaneTakeoff');
const CalendarIcon = getIcon('Calendar');
const UserIcon = getIcon('User');
const SearchIcon = getIcon('Search');
const ArrowLeftIcon = getIcon('ArrowLeft');

const FlightSearch = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'roundtrip'
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin city is required';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination city is required';
    }
    
    if (!formData.departDate) {
      newErrors.departDate = 'Departure date is required';
    }
    
    if (formData.tripType === 'roundtrip' && !formData.returnDate) {
      newErrors.returnDate = 'Return date is required for round trips';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSearching(false);
      toast.success(`Successfully found flights from ${formData.origin} to ${formData.destination}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-primary hover:text-primary-dark transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
            <PlaneTakeoffIcon className="w-8 h-8 mr-3 text-primary" />
            Flight Search
          </h1>
          <p className="text-lg text-surface-700 dark:text-surface-300">
            Find the best flights with competitive prices across multiple airlines
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6 md:p-8"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="form-label" htmlFor="origin">Origin City</label>
                <div className="relative">
                  <PlaneTakeoffIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 w-5 h-5" />
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className={`form-input pl-10 ${errors.origin ? 'border-red-500' : ''}`}
                    placeholder="From where?"
                  />
                </div>
                {errors.origin && <p className="text-red-500 text-sm mt-1">{errors.origin}</p>}
              </div>
              
              <div>
                <label className="form-label" htmlFor="destination">Destination City</label>
                <div className="relative">
                  <PlaneLandingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 w-5 h-5" />
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className={`form-input pl-10 ${errors.destination ? 'border-red-500' : ''}`}
                    placeholder="Where to?"
                  />
                </div>
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full py-3 flex items-center justify-center"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search Flights'}
              {!isSearching && <SearchIcon className="ml-2 w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FlightSearch;