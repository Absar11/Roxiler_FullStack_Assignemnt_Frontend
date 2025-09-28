import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats, fetchAdminUsers, clearAdminError } from '../features/admin/adminSlice';
import UserManagement from '../components/admin/UserManagement'; 

const StatCard = ({ title, value, color }) => (
    <div className={`bg-white p-5 rounded-lg shadow-md border-l-4 ${color}`}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, userList, isLoading, error } = useSelector((state) => state.admin);
    const [activeTab, setActiveTab] = useState('stats'); 

    useEffect(() => {
        dispatch(fetchAdminStats());
        dispatch(fetchAdminUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => dispatch(clearAdminError()), 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);
    
    const tabClass = (tab) => 
        `px-4 py-2 font-semibold transition-colors ${
            activeTab === tab 
                ? 'border-b-2 border-indigo-600 text-indigo-700' 
                : 'text-gray-500 hover:text-indigo-600'
        }`;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">System Administrator Dashboard</h1>

            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>}

            <div className="border-b border-gray-200 mb-6 flex space-x-4">
                <button className={tabClass('stats')} onClick={() => setActiveTab('stats')}>
                    Overview
                </button>
                <button className={tabClass('users')} onClick={() => setActiveTab('users')}>
                    User Management
                </button>
            </div>

            {/* --- Tab Content --- */}
            {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Users" value={stats.totalUsers || 0} color="border-l-indigo-500" />
                    <StatCard title="Total Stores" value={stats.totalStores || 0} color="border-l-green-500" />
                    <StatCard title="Total Ratings" value={stats.totalRatings || 0} color="border-l-yellow-500" />
                </div>
            )}
            
            {activeTab === 'users' && (
                <UserManagement 
                    userList={userList} 
                    isLoading={isLoading} 
                    dispatch={dispatch} 
                />
            )}
        </div>
    );
};

export default AdminDashboard;