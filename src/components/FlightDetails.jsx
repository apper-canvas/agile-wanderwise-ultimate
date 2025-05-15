import { useState } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icon declarations
const PlaneTakeoffIcon = getIcon('PlaneTakeoff');
const PlaneLandingIcon = getIcon('PlaneLanding');
const ClockIcon = getIcon('Clock');
const InfoIcon = getIcon('Info');
const LuggageIcon = getIcon('Luggage');
const AirplaneIcon = getIcon('Plane');
const MapPinIcon = getIcon('MapPin');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');

const FlightDetails = ({ flight, originCity, destinationCity, onClose, onProceed }) => {
  const [selectedTab, setSelectedTab] = useState('details');

  // Function to generate seat preview grid
  const renderSeatPreview = () => {
    const rows = 5;
    const cols = 6;
    const seats = [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < cols; col++) {
        // Skip the middle aisle
        if (col === 3) continue;
        
        const seatNumber = `${row + 1}${String.fromCharCode(65 + (col < 3 ? col : col - 1))}`;
        const isBooked = Math.random() > 0.6;
        
        rowSeats.push(
          <div 
            key={seatNumber}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs m-1 
              ${isBooked 
                ? 'bg-surface-300 dark:bg-surface-600 text-surface-500 dark:text-surface-400 cursor-not-allowed' 
                : 'bg-primary-light text-primary-dark cursor-pointer hover:bg-primary hover:text-white transition-colors'
              }`}
            title={isBooked ? 'Seat not available' : 'Available seat'}
          >
            {seatNumber}
          </div>
        );
        
        // Add aisle gap
        if (col === 2) {
          rowSeats.push(<div key={`aisle-${row}`} className="w-4"></div>);
        }
      }
      seats.push(
        <div key={`row-${row}`} className="flex justify-center my-1">
          {rowSeats}
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="flex justify-center bg-surface-200 dark:bg-surface-700 py-2 mb-4 rounded-lg text-sm">
          <AirplaneIcon className="w-5 h-5 mr-2" />
          <span>Front of Aircraft</span>
        </div>
        {seats}
        <p className="text-center text-sm mt-4 text-surface-500 dark:text-surface-400">
          This is a preview. Select seats during checkout.
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-5 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <AirplaneIcon className="w-5 h-5 mr-2 text-primary" />
          Flight Details
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{flight.departureTime}</div>
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1 text-surface-500" />
              <span>{originCity}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-sm text-surface-500 dark:text-surface-400">{flight.duration}</div>
            <div className="w-32 h-px bg-surface-300 dark:bg-surface-600 my-2 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <div className="text-xs text-surface-500">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold">{flight.arrivalTime}</div>
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1 text-surface-500" />
              <span>{destinationCity}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-lg"><strong>Airline:</strong> {flight.airline}</div>
        <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-lg"><strong>Flight:</strong> {flight.flightNumber}</div>
        <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-lg"><strong>Aircraft:</strong> {flight.aircraft}</div>
        <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-lg"><strong>Terminal:</strong> {flight.terminal}</div>
        <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-lg"><strong>Baggage:</strong> {flight.baggage}</div>
        <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-lg"><strong>Price:</strong> ${flight.price}</div>
      </div>
      
      <button onClick={onProceed} className="btn-primary w-full py-3">
        Proceed to Booking • ${flight.price}
      </button>
    </motion.div>
  );
};

export default FlightDetails;