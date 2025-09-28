import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData));
        alert('Registration attempt sent. Please check console/errors.');
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-indigo-700">Normal User Sign Up</h2>
                
                {error && (<div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>)}
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="name" onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name (20-60 chars)" required className="w-full px-4 py-2 border rounded-md" />
                    <input type="email" name="email" onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email Address" required className="w-full px-4 py-2 border rounded-md" />
                    <input type="text" name="address" onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Address (Max 400 chars)" required className="w-full px-4 py-2 border rounded-md" />
                    <input type="password" name="password" onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password (8-16 chars, special, uppercase)" required className="w-full px-4 py-2 border rounded-md" />
                    
                    <button type="submit" disabled={isLoading}
                        className="w-full py-2 text-white bg-indigo-600 rounded-md disabled:bg-indigo-400">
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="text-center text-sm">
                    <Link to="/login" className="font-medium text-indigo-600 hover:underline">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;