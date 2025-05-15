import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icon declarations
const SaveIcon = getIcon('Save');
const EditIcon = getIcon('Edit');
const XIcon = getIcon('X');

const SaveTripDialog = ({ onAction, destination }) => {
  // Close dialog on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onAction(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onAction]);
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={() => onAction(false)}
        />
        
        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md z-10 p-6 relative"
        >
          <button 
            onClick={() => onAction(false)}
            className="absolute top-4 right-4 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
          >
            <XIcon className="w-5 h-5" />
          </button>
          
          <h3 className="text-xl font-bold mb-2">Save Your Trip Plan?</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            You've added a new activity to your itinerary{destination ? ` for ${destination}` : ''}. Would you like to save your trip plan now?
          </p>
          
          <div className="flex gap-3 justify-end">
            <button onClick={() => onAction(false)} className="btn-secondary flex items-center gap-2">
              <EditIcon className="w-4 h-4" /> Continue Editing
            </button>
            <button onClick={() => onAction(true)} className="btn-primary flex items-center gap-2">
              <SaveIcon className="w-4 h-4" /> Save Trip
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

SaveTripDialog.propTypes = {
  onAction: PropTypes.func.isRequired,
  destination: PropTypes.string
};

export default SaveTripDialog;