import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((s) => s.auth.user);
    const initialising = useSelector((s) => s.auth.initialising);

    if (initialising) return null;

    if (!user) return <Navigate to="/login" replace />;

    return children;
};

export default ProtectedRoute;