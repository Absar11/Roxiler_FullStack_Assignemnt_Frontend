import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isAuthenticated, isLoading, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            const redirectPath = user.role === 'Admin' ? '/admin/dashboard' : user.role === 'StoreOwner' ? '/owner/dashboard' : '/stores';
            navigate(redirectPath); 
        }
    }, [isAuthenticated, user, navigate]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return;
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-indigo-700">Sign In</h2>
                
                {error && (<div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">{error}</div>)}
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full px-4 py-2 border rounded-md" />
                    <button type="submit" disabled={isLoading}
                        className="w-full py-2 text-white bg-indigo-600 rounded-md disabled:bg-indigo-400">
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className="text-center text-sm">
                    <Link to="/signup" className="font-medium text-indigo-600 hover:underline">Register (Normal User)</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;