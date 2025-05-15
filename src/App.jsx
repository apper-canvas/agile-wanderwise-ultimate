import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Icon declarations
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');

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

  return (
    <div className="min-h-screen">
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

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