import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<{ children: JSX.Element; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (role && !allowedRoles.includes(role)) return <Navigate to="/not-authorized" replace />;

  return children;
};

export default ProtectedRoute;
