import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen label="Verifying access permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Access Forbidden</h2>
        <p className="text-slate-400 max-w-md mb-6">
          Your current role (<span className="text-indigo-400 font-semibold uppercase">{user?.role}</span>) does not have authorization to view this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute;
