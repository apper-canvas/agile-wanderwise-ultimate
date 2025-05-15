import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import flightService from '../services/flightService';

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
const CreditCardIcon = getIcon('CreditCard');
const CheckIcon = getIcon('Check');
const ArrowRightIcon = getIcon('ArrowRight');

// Import FlightDetails component
import FlightDetails from '../components/FlightDetails';

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
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: Flight selection, 1: Passenger details, 2: Confirmation
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Initialize passenger details based on passenger count
  useEffect(() => {
    // Initialize passenger details when moving to that step
    if (bookingStep === 1 && selectedFlight) {
      const newPassengerDetails = [];
      for (let i = 0; i < formData.passengers; i++) {
        newPassengerDetails.push({
          firstName: '',
          lastName: '',
          dob: '',
          passportNumber: ''
        });
      }
      setPassengerDetails(newPassengerDetails);
    }
  }, [bookingStep, formData.passengers, selectedFlight]);
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
    flightService.searchFlights(formData).then(results => {
      setIsSearching(false);
      setFlightResults(results);
      toast.success(`Found ${results.flights.length} flights from ${formData.origin} to ${formData.destination}`);
    })
    .catch(err => toast.error('Error searching for flights. Please try again.'));
  };
  
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    // Show success toast with more detailed message
    toast.success(`Flight ${flight.flightNumber} selected successfully. View details below.`);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };
  
  const handlePassengerDetailsChange = (index, field, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengerDetails(updatedPassengers);
  };
  
  const validatePassengerDetails = () => {
    // Basic validation for passenger details
    for (let i = 0; i < passengerDetails.length; i++) {
      const passenger = passengerDetails[i];
      if (!passenger.firstName || !passenger.lastName) {
        toast.error(`Please provide complete details for Passenger ${i + 1}`);
        return false;
      }
    }
    return true;
  };
  
  const handleProceedToPassengerDetails = () => {
    setBookingStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleProceedToConfirmation = () => {
    if (!validatePassengerDetails()) return;
    
    setBookingStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleConfirmBooking = async () => {
    setIsBooking(true);
    
    try {
      const result = await flightService.bookFlight(selectedFlight, passengerDetails);
      
      setBookingConfirmation(result);
      setBookingStep(3);
      toast.success('Flight booked successfully!');
    } catch (error) {
      toast.error('Error processing your booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };
  
  const resetBooking = () => {
    setSelectedFlight(null);
    setBookingStep(0);
    setPassengerDetails([]);
    setBookingConfirmation(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        {bookingStep === 0 && (
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
        )}
        
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
        
        {!isSearching && flightResults && bookingStep === 0 && (
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
                    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center ${selectedFlight?.flightNumber === flight.flightNumber ? 'border-l-4 border-primary pl-3' : ''}`}>
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <PlaneTakeoffIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{flight.airline}</p>
                          <p className="text-surface-500 dark:text-surface-400 text-sm">Flight {flight.flightNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center px-0 md:px-6 py-2 w-full">
                        <div className="text-center w-1/3"><p className="font-bold">{flight.departureTime}</p><p className="text-sm text-surface-500 dark:text-surface-400">{formData.origin}</p></div>
                        <div className="text-center text-surface-500 dark:text-surface-400 text-sm py-1 w-1/3">
                          {flight.duration}
                          <div className="text-xs">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</div>
                        </div>
                        <div className="text-center w-1/3"><p className="font-bold">{flight.arrivalTime}</p><p className="text-sm text-surface-500 dark:text-surface-400">{formData.destination}</p></div>
                      </div>
                      
                      <button 
                        onClick={() => handleSelectFlight(flight)}
                        className={`${selectedFlight?.flightNumber === flight.flightNumber 
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'btn-primary'} mt-3 md:mt-0 px-4 py-2 rounded-lg text-white font-medium`}
                      >
                        {selectedFlight?.flightNumber === flight.flightNumber 
                          ? <span className="flex items-center"><CheckIcon className="w-4 h-4 mr-1" /> Selected</span>
                          : `Select • $${flight.price}`}
                      </button>
                    </div>
                  </div>
                  
                  
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6 text-center">
                <p className="text-lg">No flights found for your search criteria. Try different dates or destinations.</p>
              </div>
            )}
            
            {/* Selected Flight Details */}
            <AnimatePresence>
              {selectedFlight && (
                <FlightDetails 
                  flight={selectedFlight} 
                  originCity={formData.origin}
                  destinationCity={formData.destination}
                  onClose={() => setSelectedFlight(null)}
                  onProceed={handleProceedToPassengerDetails}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
        
        {/* Passenger Details Form */}
        {bookingStep === 1 && selectedFlight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Passenger Details</h2>
              <button 
                onClick={() => setBookingStep(0)}
                className="text-primary hover:text-primary-dark transition-colors flex items-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back to Flight Selection
              </button>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6 mb-6">
              <div className="flex items-center justify-between pb-4 border-b border-surface-200 dark:border-surface-700 mb-4">
                <div>
                  <div className="font-bold">{selectedFlight.airline} {selectedFlight.flightNumber}</div>
                  <div className="text-sm text-surface-500">{formData.origin} to {formData.destination}</div>
                </div>
                <div className="font-bold">${selectedFlight.price}</div>
              </div>
              
              <form>
                {Array.from({ length: formData.passengers }).map((_, index) => (
                  <div key={index} className="mb-6 pb-6 border-b border-surface-200 dark:border-surface-700 last:border-0">
                    <h3 className="text-lg font-semibold mb-4">Passenger {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor={`firstName-${index}`}>
                          First Name*
                        </label>
                        <input
                          id={`firstName-${index}`}
                          type="text"
                          className="input-field"
                          value={passengerDetails[index]?.firstName || ''}
                          onChange={(e) => handlePassengerDetailsChange(index, 'firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor={`lastName-${index}`}>
                          Last Name*
                        </label>
                        <input
                          id={`lastName-${index}`}
                          type="text"
                          className="input-field"
                          value={passengerDetails[index]?.lastName || ''}
                          onChange={(e) => handlePassengerDetailsChange(index, 'lastName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor={`dob-${index}`}>
                          Date of Birth
                        </label>
                        <input
                          id={`dob-${index}`}
                          type="date"
                          className="input-field"
                          value={passengerDetails[index]?.dob || ''}
                          onChange={(e) => handlePassengerDetailsChange(index, 'dob', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium" htmlFor={`passport-${index}`}>
                          Passport Number
                        </label>
                        <input
                          id={`passport-${index}`}
                          type="text"
                          className="input-field"
                          value={passengerDetails[index]?.passportNumber || ''}
                          onChange={(e) => handlePassengerDetailsChange(index, 'passportNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={handleProceedToConfirmation}
                  className="btn-primary w-full py-3 flex items-center justify-center"
                >
                  Continue to Payment <ArrowRightIcon className="ml-2 w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
        
        {/* Booking Confirmation */}
        {bookingStep === 2 && selectedFlight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Booking Summary</h2>
              <button 
                onClick={() => setBookingStep(1)}
                className="text-primary hover:text-primary-dark transition-colors flex items-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back to Passenger Details
              </button>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6 mb-6">
              <div className="border-b border-surface-200 dark:border-surface-700 pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Flight Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Airline:</strong> {selectedFlight.airline}</div>
                  <div><strong>Flight:</strong> {selectedFlight.flightNumber}</div>
                  <div><strong>From:</strong> {formData.origin}</div>
                  <div><strong>To:</strong> {formData.destination}</div>
                  <div><strong>Departure:</strong> {selectedFlight.departureTime}</div>
                  <div><strong>Arrival:</strong> {selectedFlight.arrivalTime}</div>
                </div>
              </div>
              
              <div className="border-b border-surface-200 dark:border-surface-700 pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
                {passengerDetails.map((passenger, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <h4 className="font-medium">Passenger {i + 1}</h4>
                    <div className="text-sm text-surface-700 dark:text-surface-300">
                      {passenger.firstName} {passenger.lastName}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-b border-surface-200 dark:border-surface-700 pb-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${selectedFlight.price * formData.passengers}.00</span>
                </div>
                <div className="text-sm text-surface-500 mt-1 text-right">
                  ${selectedFlight.price}.00 × {formData.passengers} {formData.passengers === 1 ? 'passenger' : 'passengers'}
                </div>
              </div>
              
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="btn-primary w-full py-3 flex items-center justify-center"
              >
                {isBooking ? 'Processing...' : 
                  <>Confirm and Pay <CreditCardIcon className="ml-2 w-4 h-4" /></>}
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Booking Confirmation Success */}
        {bookingStep === 3 && bookingConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-soft-dark p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Booking Confirmed!</h2>
              <p className="text-lg mb-6">Thank you for booking with WanderWise.</p>
              
              <div className="bg-surface-100 dark:bg-surface-700 p-4 rounded-lg inline-block mb-8">
                <div className="text-sm text-surface-600 dark:text-surface-400">Booking Reference</div>
                <div className="text-2xl font-mono font-bold">{bookingConfirmation.bookingReference}</div>
              </div>
              
              <div className="text-left mb-8">
                <div className="font-semibold mb-2">A confirmation email has been sent with your booking details.</div>
                <p className="text-surface-600 dark:text-surface-400 text-sm">
                  Please keep your booking reference handy for check-in and any future inquiries.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={resetBooking} className="btn-primary">
                  Book Another Flight
                </button>
                <button onClick={() => navigate('/')} className="btn-outline">Return to Home</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;