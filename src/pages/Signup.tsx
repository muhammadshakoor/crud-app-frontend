import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:8080/api/auth/signup', {
        username,
        password,
        role,
      });

      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Signup failed');
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="p-8 max-w-md mx-auto mt-10 shadow-lg rounded bg-white"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

      <input
        className="w-full p-2 border mb-4 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      <input
        className="w-full p-2 border mb-4 rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <select
        className="w-full p-2 border mb-4 rounded"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>

      <p className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Signup;
