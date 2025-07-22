import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { username, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // Clears token, role, username from AuthContext & localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    // "p-8 max-w-4xl mx-auto mt-10 bg-white rounded shadow-lg transition-all duration-500 hover:shadow-xl"
    <div className="p-8 max-w-4xl mx-auto mt-10 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to the Dashboard</h2>
      {username && role && (
        <p className="text-lg text-gray-600">
          Hello, <span className="font-semibold">{username}</span>! You are logged in as{' '}
          <span className="text-blue-600 font-semibold">{role}</span>.
        </p>
      )}
      <div className="mt-6">
        <p className="text-gray-500">
          You can now view and manage products using the navigation above.
        </p>
      </div>
      
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>

    </div>
  );
};

export default Dashboard;
