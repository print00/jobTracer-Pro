import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-textMuted">Loading your workspace...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
