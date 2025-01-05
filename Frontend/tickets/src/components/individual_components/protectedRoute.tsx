import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
