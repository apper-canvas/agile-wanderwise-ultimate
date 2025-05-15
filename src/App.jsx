import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { isOnline, subscribeToNetworkChanges } from './utils/offlineUtils';
import { register } from './serviceWorker';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
const Destinations = lazy(() => import('./pages/Destinations'));
import Header from './components/Header';
import NotFound from './pages/NotFound';

const AddDestination = lazy(() => import('./pages/AddDestination'));
// New import - Destination details page
// Icon declarations
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');
const WifiOffIcon = getIcon('WifiOff');
const WifiIcon = getIcon('Wifi');

// Lazy-loaded components
const DestinationGuides = lazy(() => import('./components/DestinationGuides'));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'));

function App() {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true' || 
        (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Network status
  const [isNetworkOnline, setIsNetworkOnline] = useState(isOnline);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Register service worker
  useEffect(() => {
    register({
      onSuccess: () => console.log('Service worker registered successfully'),
      onUpdate: () => console.log('Service worker updated')
    });
    
    // Setup network status monitoring
    const handleOnline = () => {
      setIsNetworkOnline(true);
      toast.success('You are back online!');
    };
    
    const handleOffline = () => {
      setIsNetworkOnline(false);
      toast.warn('You are offline. Some features may be limited.');
    };
    
    return subscribeToNetworkChanges(handleOnline, handleOffline);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Offline indicator */}
      {!isNetworkOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 py-1 px-4 text-center text-sm z-50">
          <div className="flex items-center justify-center gap-2">
            <WifiOffIcon className="w-4 h-4" />
            <span>You are offline. Using cached content.</span>
          </div>
        </div>
      )}
    
      {/* Header with navigation */}
      <Header />
    
      {/* Dark mode toggle button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-soft dark:shadow-neu-dark bg-white dark:bg-surface-800"
        aria-label="Toggle dark mode"
        whileTap={{ scale: 0.9 }}
      >
        {isDarkMode ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-indigo-600" />
        )}
      </motion.button>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/destinations" 
            element={
              <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]">Loading destinations...</div>}>
                <Destinations />
              </Suspense>
            } 
          />
          <Route 
            path="/destinations/:id" 
            element={
              <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]">
                <div className="text-center">Loading destination details...</div>
              </div>}>
                <DestinationDetails />
              </Suspense>
            } 
          />
          <Route 
            path="/destinations/add" 
            element={
              <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]">
                <div className="text-center">Loading form...</div>
              </div>}>
                <AddDestination />
              </Suspense>
            } 
          />
          <Route 
            path="/destination-guides/*" 
            element={
              <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]">Loading guides...</div>}>
                <DestinationGuides />
              </Suspense>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        toastStyle={{
          borderRadius: '0.75rem',
          fontFamily: 'Inter, sans-serif',
        }}
      />
    </div>
  );
}

export default App;