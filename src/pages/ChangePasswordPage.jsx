import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosBase from '../api/axiosBase'; 
import { logout } from '../features/auth/authSlice';

const ChangePasswordPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [status, setStatus] = useState({ message: '', type: '' }); 
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        if (newPassword !== confirmPassword) {
            return setStatus({ message: 'New passwords do not match.', type: 'error' });
        }

        if (currentPassword === newPassword) {
            return setStatus({ message: 'New password must be different from current password.', type: 'error' });
        }
        
        if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            return setStatus({ message: 'New password must be 8-16 chars, contain 1 uppercase, and 1 special character.', type: 'error' });
        }
        
        setIsLoading(true);

        try {
            await axiosBase.put('/users/change-password', {
                current_password: currentPassword,
                password: newPassword, 
            });
            
            setStatus({ message: 'Password successfully updated! Please log in again.', type: 'success' });
            
            setTimeout(() => {
                dispatch(logout());
            }, 2000); 

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update password. Server error.';
            setStatus({ message: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const statusClass = status.type === 'success' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300';

    return (
        <div className="flex items-center justify-center p-6 min-h-[calc(100vh-64px)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800">Update Password</h2>
                <p className="text-gray-600">You are logged in as: <span className="font-semibold">{user?.email}</span></p>

                {status.message && (
                    <div className={`p-3 text-sm border rounded-lg ${statusClass}`} role="alert">
                        {status.message}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required 
                            className="w-full px-4 py-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
                            className="w-full px-4 py-2 mt-1 border rounded-md" />
                        <p className="text-xs text-gray-500 mt-1">8-16 chars, 1 Uppercase, 1 Special char.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                            className="w-full px-4 py-2 mt-1 border rounded-md" />
                    </div>
                    
                    <button type="submit" disabled={isLoading}
                        className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;