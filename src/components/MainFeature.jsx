import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, addDays, isAfter, differenceInDays } from 'date-fns';
import getIcon from '../utils/iconUtils';
import { saveTripPlan } from '../services/indexedDBService';

// Icon declarations
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash');
const CalendarIcon = getIcon('Calendar');
const MapPinIcon = getIcon('MapPin');
const DollarSignIcon = getIcon('DollarSign');
const ClockIcon = getIcon('Clock');
const PenToolIcon = getIcon('PenTool');
const SaveIcon = getIcon('Save');
const AirplaneIcon = getIcon('Plane');
const HotelIcon = getIcon('Hotel');
const UtensilsIcon = getIcon('Utensils');
const LandmarkIcon = getIcon('Landmark');
const ShuffleIcon = getIcon('Shuffle');
const AlertCircleIcon = getIcon('AlertCircle');

// Activity type options with icons
const activityTypes = [
  { id: 'flight', name: 'Flight', icon: <AirplaneIcon className="w-4 h-4" /> },
  { id: 'accommodation', name: 'Accommodation', icon: <HotelIcon className="w-4 h-4" /> },
  { id: 'food', name: 'Food', icon: <UtensilsIcon className="w-4 h-4" /> },
  { id: 'attraction', name: 'Attraction', icon: <LandmarkIcon className="w-4 h-4" /> },
  { id: 'other', name: 'Other', icon: <PenToolIcon className="w-4 h-4" /> }
];

// Get today's date formatted as YYYY-MM-DD
const today = new Date();
const formatDateForInput = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const MainFeature = () => {
  // State for trip details
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(formatDateForInput(today));
  const [endDate, setEndDate] = useState(formatDateForInput(addDays(today, 7)));
  const [budget, setBudget] = useState('');
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState('');
  
  // State for adding new activity
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    type: 'attraction',
    location: '',
    date: startDate,
    startTime: '09:00',
    cost: '',
    notes: ''
  });
  
  // State for errors
  const [errors, setErrors] = useState({});
  
  // State for the selected day in the itinerary view
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Update newActivity date when startDate changes
  useEffect(() => {
    setNewActivity(prev => ({ ...prev, date: startDate }));
  }, [startDate]);
  
  // Validate dates when they change
  useEffect(() => {
    validateDates();
  }, [startDate, endDate]);
  
  // Calculate days in the trip
  const daysInTrip = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  
  // Validate dates
  const validateDates = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isAfter(start, end)) {
      setErrors(prev => ({ 
        ...prev, 
        dates: "End date cannot be before start date" 
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dates;
        return newErrors;
      });
    }
  };
  
  // Generate days for the itinerary
  const generateDays = () => {
    if (!startDate || !endDate) return [];
    
    const days = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      days.push({
        date: formatDateForInput(currentDate),
        formattedDate: format(currentDate, 'EEE, MMM d')
      });
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  };
  
  const days = generateDays();
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = {};
    if (!tripName) formErrors.tripName = "Trip name is required";
    if (!destination) formErrors.destination = "Destination is required";
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Prepare trip plan data
    const tripPlanData = {
      tripName,
      destination,
      startDate,
      endDate,
      budget: budget ? parseFloat(budget) : null,
      activities,
      notes,
      totalSpent,
      daysInTrip
    };

    // Show loading toast
    const loadingToast = toast.loading("Saving your trip plan...");

    // Save to IndexedDB
    saveTripPlan(tripPlanData).then(result => {
      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        // Successfully saved trip
        toast.success("Your trip plan has been saved successfully!");
        
        // Optionally: Clear form or reset to initial state if needed
        // setTripName('');
        // setDestination('');
        // setActivities([]);
        // etc.
      } else {
        // Error saving trip
        toast.error(`Failed to save trip plan: ${result.error}`);
      }
    });
  };
  
  // Add a new activity
  const addActivity = (e) => {
    e.preventDefault();
    
    // Validate activity
    const activityErrors = {};
    if (!newActivity.name) activityErrors.activityName = "Activity name is required";
    if (!newActivity.location) activityErrors.activityLocation = "Location is required";
    
    if (Object.keys(activityErrors).length > 0) {
      setErrors(activityErrors);
      return;
    }
    
    // Add activity
    const activity = {
      ...newActivity,
      id: Date.now().toString(),
      cost: newActivity.cost ? parseFloat(newActivity.cost) : 0
    };
    
    setActivities([...activities, activity]);
    toast.success("Activity added to your itinerary!");
    
    // Reset form
    setNewActivity({
      name: '',
      type: 'attraction',
      location: '',
      date: startDate,
      startTime: '09:00',
      cost: '',
      notes: ''
    });
    setShowActivityForm(false);
    
    // Clear errors
    setErrors({});
  };
  
  // Delete an activity
  const deleteActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
    toast.info("Activity removed from your itinerary");
  };
  
  // Filter activities by selected day
  const filteredActivities = selectedDay
    ? activities.filter(activity => activity.date === selectedDay)
    : activities;
  
  // Calculate total budget spent
  const totalSpent = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
  const budgetRemaining = budget ? parseFloat(budget) - totalSpent : null;
  
  // Generate random destination suggestion
  const suggestDestination = () => {
    const destinations = [
      "Paris, France", 
      "Tokyo, Japan", 
      "Bali, Indonesia", 
      "Rome, Italy",
      "New York City, USA", 
      "Santorini, Greece", 
      "Cape Town, South Africa",
      "Kyoto, Japan", 
      "Barcelona, Spain", 
      "Sydney, Australia"
    ];
    
    const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
    setDestination(randomDestination);
  };
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card dark:shadow-neu-dark overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold mb-6">Plan Your Trip</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trip Name */}
            <div>
              <label htmlFor="tripName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Trip Name
              </label>
              <input
                type="text"
                id="tripName"
                className={`input-field ${errors.tripName ? 'border-red-500 dark:border-red-500' : ''}`}
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Summer Vacation 2023"
              />
              {errors.tripName && (
                <p className="mt-1 text-sm text-red-500">{errors.tripName}</p>
              )}
            </div>
            
            {/* Destination */}
            <div className="relative">
              <label htmlFor="destination" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Destination
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="destination"
                  className={`input-field flex-grow ${errors.destination ? 'border-red-500 dark:border-red-500' : ''}`}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you going?"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={suggestDestination}
                  className="flex items-center justify-center p-2 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  title="Get destination suggestion"
                >
                  <ShuffleIcon className="w-5 h-5 text-primary" />
                </motion.button>
              </div>
              {errors.destination && (
                <p className="mt-1 text-sm text-red-500">{errors.destination}</p>
              )}
            </div>
            
            {/* Date Range */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Start Date
              </label>
              <div className="flex items-center">
                <span className="absolute ml-3 text-surface-500 dark:text-surface-400">
                  <CalendarIcon className="w-5 h-5" />
                </span>
                <input
                  type="date"
                  id="startDate"
                  className="input-field pl-10"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={formatDateForInput(today)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                End Date
              </label>
              <div className="flex items-center">
                <span className="absolute ml-3 text-surface-500 dark:text-surface-400">
                  <CalendarIcon className="w-5 h-5" />
                </span>
                <input
                  type="date"
                  id="endDate"
                  className={`input-field pl-10 ${errors.dates ? 'border-red-500 dark:border-red-500' : ''}`}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
              {errors.dates && (
                <p className="mt-1 text-sm text-red-500">{errors.dates}</p>
              )}
            </div>
            
            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Budget (optional)
              </label>
              <div className="flex items-center">
                <span className="absolute ml-3 text-surface-500 dark:text-surface-400">
                  <DollarSignIcon className="w-5 h-5" />
                </span>
                <input
                  type="number"
                  id="budget"
                  className="input-field pl-10"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Total budget for the trip"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                className="input-field min-h-[80px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or things to remember..."
              ></textarea>
            </div>
          </div>
          
          {/* Budget Summary (if budget is provided) */}
          {budget && (
            <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
              <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                <DollarSignIcon className="w-5 h-5 text-green-500" />
                Budget Overview
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Total Budget</p>
                  <p className="text-xl font-semibold">${parseFloat(budget).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Planned Expenses</p>
                  <p className="text-xl font-semibold">${totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Remaining</p>
                  <p className={`text-xl font-semibold ${budgetRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${budgetRemaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Itinerary Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold">Your Itinerary</h4>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowActivityForm(true)}
                className="btn-primary flex items-center gap-2 text-sm py-2"
                disabled={showActivityForm}
              >
                <PlusIcon className="w-4 h-4" />
                Add Activity
              </motion.button>
            </div>
            
            {/* Days tabs */}
            {days.length > 0 && (
              <div className="mb-4 border-b border-surface-200 dark:border-surface-700">
                <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(null)}
                    className={`px-4 py-2 text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                      selectedDay === null 
                        ? 'bg-primary text-white'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    All Days ({daysInTrip})
                  </button>
                  
                  {days.map((day, index) => (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedDay(day.date)}
                      className={`px-4 py-2 text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                        selectedDay === day.date 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-surface-100 dark:hover:bg-surface-700'
                      }`}
                    >
                      Day {index + 1}: {day.formattedDate}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Activity Form */}
            <AnimatePresence>
              {showActivityForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mb-6 p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                    <h5 className="text-lg font-medium mb-4">Add New Activity</h5>
                    
                    <form onSubmit={addActivity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Activity Name */}
                      <div>
                        <label htmlFor="activityName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Activity Name *
                        </label>
                        <input
                          type="text"
                          id="activityName"
                          className={`input-field ${errors.activityName ? 'border-red-500 dark:border-red-500' : ''}`}
                          value={newActivity.name}
                          onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                          placeholder="e.g., Visit Eiffel Tower"
                        />
                        {errors.activityName && (
                          <p className="mt-1 text-sm text-red-500">{errors.activityName}</p>
                        )}
                      </div>
                      
                      {/* Activity Type */}
                      <div>
                        <label htmlFor="activityType" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Activity Type
                        </label>
                        <select
                          id="activityType"
                          className="input-field"
                          value={newActivity.type}
                          onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                        >
                          {activityTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Location */}
                      <div>
                        <label htmlFor="activityLocation" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Location *
                        </label>
                        <div className="flex items-center">
                          <span className="absolute ml-3 text-surface-500 dark:text-surface-400">
                            <MapPinIcon className="w-5 h-5" />
                          </span>
                          <input
                            type="text"
                            id="activityLocation"
                            className={`input-field pl-10 ${errors.activityLocation ? 'border-red-500 dark:border-red-500' : ''}`}
                            value={newActivity.location}
                            onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                            placeholder="Address or location name"
                          />
                        </div>
                        {errors.activityLocation && (
                          <p className="mt-1 text-sm text-red-500">{errors.activityLocation}</p>
                        )}
                      </div>
                      
                      {/* Date */}
                      <div>
                        <label htmlFor="activityDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Date
                        </label>
                        <div className="flex items-center">
                          <span className="absolute ml-3 text-surface-500 dark:text-surface-400">
                            <CalendarIcon className="w-5 h-5" />
                          </span>
                          <select
                            id="activityDate"
                            className="input-field pl-10"
                            value={newActivity.date}
                            onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                          >
                            {days.map(day => (
                              <option key={day.date} value={day.date}>
                                {day.formattedDate}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Start Time */}
                      <div>
                        <label htmlFor="activityTime" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Start Time
                        </label>
                        <div className="flex items-center">
                          <span className="absolute ml-3 text-surface-500 dark:text-surface-400">
                            <ClockIcon className="w-5 h-5" />
                          </span>
                          <input
                            type="time"
                            id="activityTime"
                            className="input-field pl-10"
                            value={newActivity.startTime}
                            onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      {/* Cost */}
                      <div>
                        <label htmlFor="activityCost" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Cost (optional)
                        </label>
                        <div className="flex items-center">
                          <span className="absolute ml-3 text-surface-500 dark:text-surface-400">
                            <DollarSignIcon className="w-5 h-5" />
                          </span>
                          <input
                            type="number"
                            id="activityCost"
                            className="input-field pl-10"
                            value={newActivity.cost}
                            onChange={(e) => setNewActivity({...newActivity, cost: e.target.value})}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      
                      {/* Notes */}
                      <div className="md:col-span-2">
                        <label htmlFor="activityNotes" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Notes (optional)
                        </label>
                        <textarea
                          id="activityNotes"
                          className="input-field min-h-[60px]"
                          value={newActivity.notes}
                          onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                          placeholder="Additional details about this activity..."
                        ></textarea>
                      </div>
                      
                      <div className="md:col-span-2 flex flex-wrap gap-3 justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => setShowActivityForm(false)}
                          className="px-4 py-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          Add to Itinerary
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Activity List */}
            <div className="min-h-[200px]">
              {filteredActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-6 bg-surface-50 dark:bg-surface-700/30 rounded-lg border border-dashed border-surface-300 dark:border-surface-600">
                  <div className="mb-3 text-surface-400">
                    <CalendarIcon className="w-10 h-10" />
                  </div>
                  <h5 className="text-lg font-medium mb-1">No activities added yet</h5>
                  <p className="text-surface-600 dark:text-surface-400 max-w-md">
                    {selectedDay 
                      ? `No activities planned for this day. Click "Add Activity" to create your itinerary.`
                      : `Start building your trip itinerary by clicking "Add Activity" above.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivities.map((activity) => {
                    // Find the day information for this activity
                    const day = days.find(d => d.date === activity.date);
                    const dayIndex = days.findIndex(d => d.date === activity.date);
                    
                    // Get the right icon based on activity type
                    const activityType = activityTypes.find(t => t.id === activity.type);
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col sm:flex-row p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {/* Time & Type */}
                        <div className="sm:w-44 mb-3 sm:mb-0 flex flex-row sm:flex-col">
                          {!selectedDay && (
                            <div className="text-sm font-semibold text-primary-light dark:text-primary mb-1 sm:mb-2">
                              Day {dayIndex + 1}: {day?.formattedDate}
                            </div>
                          )}
                          <div className="flex items-center gap-2 sm:mb-1">
                            <ClockIcon className="w-4 h-4 text-surface-500" />
                            <span className="text-sm">{activity.startTime}</span>
                          </div>
                          <div className="ml-4 sm:ml-0 flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 bg-surface-100 dark:bg-surface-700 rounded-full text-surface-700 dark:text-surface-300">
                              {activityType?.icon}
                            </span>
                            <span className="text-sm text-surface-600 dark:text-surface-400">
                              {activityType?.name}
                            </span>
                          </div>
                        </div>
                        
                        {/* Activity Details */}
                        <div className="flex-grow">
                          <h5 className="text-lg font-semibold mb-1">{activity.name}</h5>
                          <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400 mb-2">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{activity.location}</span>
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{activity.notes}</p>
                          )}
                        </div>
                        
                        {/* Cost & Actions */}
                        <div className="flex items-center justify-between sm:w-32 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-200 dark:border-surface-700">
                          {activity.cost > 0 && (
                            <div className="text-sm font-medium">
                              ${parseFloat(activity.cost).toFixed(2)}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteActivity(activity.id)}
                            className="ml-auto p-2 text-surface-500 hover:text-red-500 transition-colors rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                            aria-label="Delete activity"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Save Trip Button */}
          <div className="mt-8 flex justify-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
            >
              <SaveIcon className="w-5 h-5" />
              Save Trip Plan
            </motion.button>
          </div>
          
          {/* Tips & Requirements */}
          {tripName && destination && (
            <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <AlertCircleIcon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-medium mb-1">Trip Planning Tips</h5>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Remember to check visa requirements for {destination}. Consider booking accommodations and transportation in advance, especially during peak seasons.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MainFeature;