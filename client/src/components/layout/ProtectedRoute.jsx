import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthInitialized } from '../../redux/slices/authSlice';

/**
 * Wraps routes that require authentication.
 * Waits for the initial auth check to complete before deciding to redirect
 * so we don't flash the login page on hard refresh.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialized     = useSelector(selectAuthInitialized);
  const location        = useLocation();

  // Still checking the cookie — render nothing to prevent flash
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
