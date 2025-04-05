import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    // Loading state
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};