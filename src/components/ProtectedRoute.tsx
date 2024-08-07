// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? <>{children}</> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
