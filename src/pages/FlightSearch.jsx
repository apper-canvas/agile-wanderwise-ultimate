import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { searchFlights } from '../services/flightService';

// Icon declarations
const PlaneLandingIcon = getIcon('PlaneLanding');
const PlaneTakeoffIcon = getIcon('PlaneTakeoff');
const CalendarIcon = getIcon('Calendar');
const UserIcon = getIcon('User');
const UsersIcon = getIcon('Users');
const SearchIcon = getIcon('Search');
const ArrowLeftIcon = getIcon('ArrowLeft');
const PlusIcon = getIcon('Plus');
const MinusIcon = getIcon('Minus');

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
  const [flightResults, setFlightResults] = useState(null);

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

  const handlePassengerChange = (increment) => {
    const newValue = formData.passengers + increment;
    if (newValue >= 1 && newValue <= 9) {
      setFormData({
        ...formData,
        passengers: newValue
      });
    }
  };
  
  const handleTripTypeChange = (type) => {
    setFormData({
      ...formData,
      tripType: type,
      // Clear return date if switching to one-way
      returnDate: type === 'oneway' ? '' : formData.returnDate
    });
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
    searchFlights(formData).then(results => {
      setIsSearching(false);
      setFlightResults(results);
      toast.success(`Found ${results.flights.length} flights from ${formData.origin} to ${formData.destination}`);
    })
    .catch(err => toast.error('Error searching for flights. Please try again.'));
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
              {/* Trip Type Selection */}
              <div className="md:col-span-2">
                <div className="flex border border-surface-200 dark:border-surface-600 rounded-lg overflow-hidden mb-2">
                  <button 
                    type="button" 
                    onClick={() => handleTripTypeChange('roundtrip')}
                    className={`flex-1 py-2 text-center transition-colors ${formData.tripType === 'roundtrip' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700'}`}>Round Trip</button>
                  <button 
                    type="button" 
                    onClick={() => handleTripTypeChange('oneway')}
                    className={`flex-1 py-2 text-center transition-colors ${formData.tripType === 'oneway' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700'}`}>One Way</button>
                </div>
              </div>
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
                    className={`input-field pl-10 ${errors.origin ? 'border-red-500' : ''}`}
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
                    className={`input-field pl-10 ${errors.destination ? 'border-red-500' : ''}`}
                    placeholder="Where to?"
                  />
                </div>
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
              </div>
              
              <div>
                <label className="form-label" htmlFor="departDate">Departure Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 w-5 h-5" />
                  <input
                    type="date"
                    id="departDate"
                    name="departDate"
                    value={formData.departDate}
                    onChange={handleInputChange}
                    className={`input-field pl-10 ${errors.departDate ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.departDate && <p className="text-red-500 text-sm mt-1">{errors.departDate}</p>}
              </div>
              
              {formData.tripType === 'roundtrip' && (
                <div>
                  <label className="form-label" htmlFor="returnDate">Return Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 w-5 h-5" />
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.returnDate ? 'border-red-500' : ''}`}
                      min={formData.departDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
                </div>
              )}
              
              {formData.tripType === 'oneway' && (
                <div>
                  <label className="form-label" htmlFor="passengers">Passengers</label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 w-5 h-5" />
                      <input
                        type="text"
                        id="passengers"
                        name="passengers"
                        value={formData.passengers}
                        readOnly
                        className="input-field pl-10 text-center"
                      />
                    </div>
                    <button type="button" onClick={() => handlePassengerChange(-1)} className="ml-2 p-2 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors" disabled={formData.passengers <= 1}><MinusIcon className="w-5 h-5" /></button>
                    <button type="button" onClick={() => handlePassengerChange(1)} className="ml-2 p-2 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors" disabled={formData.passengers >= 9}><PlusIcon className="w-5 h-5" /></button>
                  </div>
                </div>
              )}
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
        
        {/* Flight Results Section */}
        {isSearching && (
          <div className="mt-8">
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6 md:p-8">
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-3 text-lg">Searching for the best flights...</span>
              </div>
            </div>
          </div>
        )}
        
        {!isSearching && flightResults && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Available Flights</h2>
            {flightResults.flights.length > 0 ? (
              <div className="space-y-4">
                {flightResults.flights.map((flight, index) => (
                  <div key={index} className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <PlaneTakeoffIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{flight.airline}</p>
                          <p className="text-surface-500 dark:text-surface-400 text-sm">Flight {flight.flightNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center px-0 md:px-6 py-2">
                        <div className="text-center"><p className="font-bold">{flight.departureTime}</p><p className="text-sm text-surface-500 dark:text-surface-400">{formData.origin}</p></div>
                        <div className="text-center text-surface-500 dark:text-surface-400 text-sm py-1">{flight.duration}</div>
                        <div className="text-center"><p className="font-bold">{flight.arrivalTime}</p><p className="text-sm text-surface-500 dark:text-surface-400">{formData.destination}</p></div>
                      </div>
                      
                      <button className="btn-primary mt-3 md:mt-0">Select • ${flight.price}</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6 text-center">
                <p className="text-lg">No flights found for your search criteria. Try different dates or destinations.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;