import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icon declarations
const CompassIcon = getIcon('Compass');
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Destination Guides', path: '/destination-guides' }
  ];
  
  return (
    <header className="bg-white dark:bg-surface-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <CompassIcon className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">WanderWise</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;