import { Component } from 'react';
import PropTypes from 'prop-types';
import getIcon from '../utils/iconUtils';

const AlertCircleIcon = getIcon('AlertCircle');
const RefreshCwIcon = getIcon('RefreshCw');

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <AlertCircleIcon className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred in the application.'}
          </p>
          <button onClick={this.handleRetry} className="btn-primary flex items-center gap-2">
            <RefreshCwIcon className="w-4 h-4" /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node.isRequired };
export default ErrorBoundary;