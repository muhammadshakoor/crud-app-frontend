import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    console.log("login pagr", import.meta.env.VITE_API_URL)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { username, password });
            login(res.data.token, res.data.role, username);
            navigate('/');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || 'Invalid credentials');
            } else {
                alert('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto mt-10 shadow-lg rounded">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <input className="w-full p-2 border mb-4" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input className="w-full p-2 border mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <p className="text-center mt-4 text-sm">
                Don’t have an account?{' '}
                <Link to="/signup" className="text-blue-600 underline">
                    Sign up here
                </Link>
            </p>
        </form>
    );
};

export default Login;
