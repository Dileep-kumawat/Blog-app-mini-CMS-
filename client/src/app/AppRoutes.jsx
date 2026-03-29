import { Route, Routes } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Home from '../features/blog/pages/Home';
import Profile from '../features/blog/pages/Profile';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import AuthProtected from '../features/auth/components/AuthProtected';

const AppRoutes = () => (
    <Routes>
        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            }
        />
        <Route
            path="/login"
            element={
                <AuthProtected>
                    <Login />
                </AuthProtected>
            }
        />
        <Route
            path="/register"
            element={
                <AuthProtected>
                    <Register />
                </AuthProtected>
            }
        />
        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            }
        />
    </Routes>
);

export default AppRoutes;