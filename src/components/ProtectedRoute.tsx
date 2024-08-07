import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Spinner from 'react-bootstrap/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="center-spinner"><Spinner animation="border" /></div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
