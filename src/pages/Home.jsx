import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Icon declarations
const CompassIcon = getIcon('Compass');
const GlobeIcon = getIcon('Globe');
const MapIcon = getIcon('Map');
const PlaneLandingIcon = getIcon('PlaneLanding');
const UtensilsIcon = getIcon('Utensils');
const HotelIcon = getIcon('Hotel');
const CarIcon = getIcon('Car');
const DollarSignIcon = getIcon('DollarSign');
const CalendarIcon = getIcon('Calendar');

const Home = () => {
  const [showTeaser, setShowTeaser] = useState(true);
  const navigate = useNavigate();

  const dismissTeaser = () => {
    setShowTeaser(false);
    toast.success("Welcome to your travel planning journey!");
  };


  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };

  const features = [
    { 
      icon: <PlaneLandingIcon className="w-6 h-6 text-primary" />, 
      title: "Flight Booking", 
      description: "Find and book the best flights with price comparison across airlines." 
    },
    { 
      icon: <HotelIcon className="w-6 h-6 text-secondary" />, 
      title: "Accommodation", 
      description: "Discover perfect stays from hotels to unique local homes." 
    },
    { 
      icon: <UtensilsIcon className="w-6 h-6 text-accent" />, 
      title: "Local Cuisine", 
      description: "Explore authentic dining options and food experiences." 
    },
    { 
      icon: <CarIcon className="w-6 h-6 text-primary-dark" />, 
      title: "Transportation", 
      description: "Navigate your destination with ease using local transport options." 
    },
    { 
      icon: <DollarSignIcon className="w-6 h-6 text-green-500" />, 
      title: "Budget Tracker", 
      description: "Keep your travel expenses organized and on track." 
    },
    { 
      icon: <CalendarIcon className="w-6 h-6 text-secondary-dark" />, 
      title: "Itinerary Planner", 
      description: "Craft the perfect day-by-day schedule for your adventures." 
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 py-16 md:py-24">
        <div className="absolute opacity-20 -top-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute opacity-10 -bottom-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 md:mb-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-secondary-light text-transparent bg-clip-text">
                Plan Your Dream Journey
              </h1>
              <p className="text-lg md:text-xl text-surface-700 dark:text-surface-300 mb-8 max-w-2xl leading-relaxed text-balance">
                Seamlessly organize your entire trip from flights and hotels to activities and local transportation, all while keeping your budget in check.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  Create Trip Plan
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline px-8 py-3 text-lg"
                  onClick={() => navigate('/destinations')}
                >
                  Explore Destinations
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Travel planning visualization" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Feature teaser that can be dismissed */}
      {showTeaser && (
        <motion.div 
          initial={{ height: 100, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-accent/10 dark:bg-accent/20 py-4 relative"
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MapIcon className="w-5 h-5 text-accent" />
              <p className="text-surface-800 dark:text-surface-200">
                Explore our new itinerary planning tool below to start your journey!
              </p>
            </div>
            <button 
              onClick={dismissTeaser} 
              className="text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Feature */}
      <section className="py-16 md:py-24 bg-white dark:bg-surface-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mb-4"
            >
              <GlobeIcon className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Start Planning Your Adventure
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-lg text-surface-600 dark:text-surface-400 max-w-3xl mx-auto"
            >
              Create your personalized travel itinerary with our interactive planning tool
            </motion.p>
          </div>
          
          <MainFeature />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-surface-50 dark:bg-surface-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All You Need For Travel Planning</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
              Comprehensive tools to make your trip planning seamless and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4 p-3 rounded-full w-14 h-14 flex items-center justify-center bg-surface-100 dark:bg-surface-700">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-surface-600 dark:text-surface-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-surface-800 dark:bg-surface-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <CompassIcon className="w-8 h-8 text-primary-light" />
              <span className="text-xl font-bold tracking-tight">WanderWise</span>
            </div>
            </div>
          
          <div className="border-t border-surface-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-surface-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} WanderWise. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-surface-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-surface-400 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
        </footer>
    </div>
  );
};

export default Home;