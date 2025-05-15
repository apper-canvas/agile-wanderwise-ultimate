import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Icons
const StarIcon = getIcon('Star');
const BookmarkIcon = getIcon('Bookmark');
const BookmarkFilledIcon = getIcon('BookmarkCheck');
const MapPinIcon = getIcon('MapPin');

const DestinationCard = ({ destination }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSaved(!isSaved);
    
    if (!isSaved) {
      toast.success(`${destination.name} added to saved destinations!`);
    } else {
      toast.info(`${destination.name} removed from saved destinations.`);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { 
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-800 shadow-card h-full"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={`/destinations/${destination.id}`} className="block h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-surface-200 dark:bg-surface-700 animate-pulse"></div>
          )}
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Save button */}
          <button
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-surface-700 transition-colors"
            onClick={handleSaveToggle}
            aria-label={isSaved ? "Remove from saved" : "Save destination"}
          >
            {isSaved ? (
              <BookmarkFilledIcon className="w-5 h-5 text-primary" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
          </button>
          
          {/* Location pill */}
          <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <MapPinIcon className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">{destination.country}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">{destination.rating}</span>
            <span className="text-xs text-surface-500 dark:text-surface-400">({destination.reviewCount} reviews)</span>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2">{destination.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;