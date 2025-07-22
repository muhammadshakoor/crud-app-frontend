import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/login')}>
        Back to Login
      </button>
    </div>
  );
};

export default NotAuthorized;