import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icon declarations
const CompassIcon = getIcon('Compass');
const MapPinIcon = getIcon('MapPin');
const ArrowLeftIcon = getIcon('ArrowLeft');

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 bg-white dark:bg-surface-800 shadow-sm">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <CompassIcon className="w-7 h-7" />
            <span className="text-xl font-bold tracking-tight">WanderWise</span>
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative mb-8 mx-auto w-48 h-48">
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 120,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0"
              >
                <CompassIcon className="w-full h-full text-primary-light opacity-50" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPinIcon className="w-16 h-16 text-secondary" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-secondary-light text-transparent bg-clip-text">
              404
            </h1>
            
            <h2 className="text-2xl md:text-3xl mb-4 font-semibold">
              Destination Not Found
            </h2>
            
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
              It seems you've wandered off the marked trail. The destination you're looking for may have moved or doesn't exist.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 btn-primary px-6 py-3"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Return to Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-surface-100 dark:bg-surface-800 py-6 px-4">
        <div className="container mx-auto text-center text-surface-600 dark:text-surface-400 text-sm">
          © {new Date().getFullYear()} WanderWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default NotFound;