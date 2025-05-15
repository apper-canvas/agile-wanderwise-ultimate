import { useState, useEffect, lazy, Suspense, createContext } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import { isOnline, subscribeToNetworkChanges } from './utils/offlineUtils';
import { register } from './serviceWorker';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
const Destinations = lazy(() => import('./pages/Destinations'));
import Header from './components/Header';
const FlightSearch = lazy(() => import('./pages/FlightSearch'));
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
const AddDestination = lazy(() => import('./pages/AddDestination'));
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');
const WifiOffIcon = getIcon('WifiOff');
const WifiIcon = getIcon('Wifi');

// Lazy-loaded components
const DestinationGuides = lazy(() => import('./components/DestinationGuides'));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'));

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

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


  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {      
      if (!isAuthPage) {
        navigate(
          currentPath.includes('/signup')
           ? `/signup?redirect=${currentPath}`
           : currentPath.includes('/login')
           ? `/login?redirect=${currentPath}`
           : '/login');
      } else if (redirectPath) {
        if (
          ![
            'error',
            'signup',
            'login',
            'callback'
          ].some((path) => currentPath.includes(path)))
          navigate(`/login?redirect=${redirectPath}`);
        else {
          navigate(currentPath);
        }
      } else if (isAuthPage) {
        navigate(currentPath);
      } else {
        navigate('/login');
      }
      dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [dispatch, navigate]);

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

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen">
        {!isNetworkOnline && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 py-1 px-4 text-center text-sm z-50">
            <div className="flex items-center justify-center gap-2">
              <WifiOffIcon className="w-4 h-4" />
              <span>You are offline. Using cached content.</span>
            </div>
          </div>
        )}

        {/* Only show header when authenticated */}
        {isAuthenticated && <Header />}

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
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/error" element={<ErrorPage />} />
                {isAuthenticated ? (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route 
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
            <Route 
              path="/flight-search" 
              element={
                <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]">
                  <div className="text-center">Loading flight search...</div>
                </div>}>
                  <FlightSearch />
                </Suspense>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
          </ErrorBoundary>
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
    </AuthContext.Provider>
  )
}

export default App;