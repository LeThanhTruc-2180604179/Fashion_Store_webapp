import React from 'react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordForm from '../components/auth/ChangePasswordForm';
import { Navigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePasswordPage; 