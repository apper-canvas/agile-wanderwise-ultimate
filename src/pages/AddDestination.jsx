import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { saveDestination } from '../services/indexedDBService';

// Icons
const ArrowLeftIcon = getIcon('ArrowLeft');
const ImageIcon = getIcon('Image');
const MapPinIcon = getIcon('MapPin');
const GlobeIcon = getIcon('Globe');
const StarIcon = getIcon('Star');
const UsersIcon = getIcon('Users');
const TagIcon = getIcon('Tag');

const AddDestination = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    continent: 'Europe',
    description: '',
    imageUrl: '',
    rating: 4.5,
    reviewCount: 0,
    tags: ''
  });

  const continents = [
    'Asia', 
    'Europe', 
    'North America', 
    'South America', 
    'Africa', 
    'Oceania'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Destination name is required';
    }
    
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }
    
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      errors.imageUrl = 'Please enter a valid URL';
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert tags from string to array
      const processedData = {
        ...formData,
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount, 10),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      // Save to IndexedDB
      const result = await saveDestination(processedData);
      
      if (result.success) {
        toast.success('Destination added successfully!');
        navigate('/destinations');
      } else {
        throw new Error(result.error || 'Failed to save destination');
      }
    } catch (error) {
      console.error('Error adding destination:', error);
      toast.error(error.message || 'Failed to add destination. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/destinations" className="inline-flex items-center text-primary hover:text-primary-dark mb-4 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Destinations
        </Link>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2"
        >
          Add New Destination
        </motion.h1>
        <p className="text-surface-600 dark:text-surface-300 max-w-2xl">
          Fill in the details below to add a new travel destination to our collection.
        </p>
      </div>
      
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination Name */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium mb-2">Destination Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Paris, Bali, Tokyo"
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
            </div>
            
            {/* Country */}
            <div className="col-span-full md:col-span-1">
              <label htmlFor="country" className="block text-sm font-medium mb-2">Country</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="text"
                  id="country"
                  name="country"
                  className={`input-field pl-10 ${formErrors.country ? 'border-red-500' : ''}`}
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., France, Indonesia, Japan"
                />
              </div>
              {formErrors.country && <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>}
            </div>
            
            {/* Continent */}
            <div>
              <label htmlFor="continent" className="block text-sm font-medium mb-2">Continent</label>
              <div className="relative">
                <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <select
                  id="continent"
                  name="continent"
                  className="input-field pl-10"
                  value={formData.continent}
                  onChange={handleInputChange}
                >
                  {continents.map(continent => (
                    <option key={continent} value={continent}>{continent}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Ratings */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium mb-2">Rating (1-5)</label>
              <div className="relative">
                <StarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  step="0.1"
                  className={`input-field pl-10 ${formErrors.rating ? 'border-red-500' : ''}`}
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.rating && <p className="mt-1 text-sm text-red-500">{formErrors.rating}</p>}
            </div>
            
            {/* Image URL */}
            <div className="col-span-full">
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className={`input-field pl-10 ${formErrors.imageUrl ? 'border-red-500' : ''}`}
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {formErrors.imageUrl && <p className="mt-1 text-sm text-red-500">{formErrors.imageUrl}</p>}
            </div>
            
            {/* Description */}
            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`input-field ${formErrors.description ? 'border-red-500' : ''}`}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what makes this destination special..."
              ></textarea>
              {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
            </div>
            
            {/* Tags */}
            <div className="col-span-full">
              <label htmlFor="tags" className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <div className="relative">
                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  className="input-field pl-10"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., Beach, Nature, Culture, Food"
                />
              </div>
              <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                Add keywords that describe this destination, separated by commas
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4 justify-end">
            <Link 
              to="/destinations" 
              className="btn bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-surface-900 dark:text-surface-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestination;