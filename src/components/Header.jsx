import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';

// Icons
const MapIcon = getIcon('Map');
const HomeIcon = getIcon('Home');
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const BookIcon = getIcon('BookOpen');
const PlaneIcon = getIcon('Plane');
const LogOutIcon = getIcon('LogOut');
const UserIcon = getIcon('User');

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Destinations', path: '/destinations', icon: MapIcon },
    { name: 'Guides', path: '/destination-guides', icon: BookIcon },
    { name: 'Flights', path: '/flight-search', icon: PlaneIcon },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-surface-800 shadow-sm dark:shadow-surface-700/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl">
            <span className="text-primary">Wander</span>
            <span>Wise</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || 
                               (link.path !== '/' && location.pathname.startsWith(link.path));
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg transition-colors duration-150 flex items-center gap-1 ${
                    isActive
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            {/* User dropdown and logout */}
            <div className="ml-4 relative flex items-center">
              <div className="flex items-center gap-2 pl-4 border-l border-surface-200 dark:border-surface-700">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-3 p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <LogOutIcon className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;