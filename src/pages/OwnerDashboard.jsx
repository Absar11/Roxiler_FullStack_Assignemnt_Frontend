import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerAverageRating, fetchOwnerRaterList, clearOwnerError } from '../features/owner/ownerSlice';

const OwnerDashboard = () => {
    const dispatch = useDispatch();
    const { averageRating, raterList, isLoading, error } = useSelector((state) => state.owner);
    const ownerName = useSelector((state) => state.auth.user?.name);

    useEffect(() => {
        dispatch(fetchOwnerAverageRating());
        dispatch(fetchOwnerRaterList());
        
        return () => dispatch(clearOwnerError());
    }, [dispatch]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Welcome, {ownerName?.split(' ')[0]} (Store Owner)</h1>
            
            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Average Rating Card */}
                <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-l-indigo-500 col-span-1">
                    <p className="text-sm font-medium text-gray-500">Store Average Rating</p>
                    <p className="text-5xl font-extrabold text-indigo-700 mt-2">
                        {isLoading ? '...' : (averageRating ? parseFloat(averageRating).toFixed(2) : 'N/A')}
                    </p>
                </div>
            </div>

            {/* List of Users Who Rated */}
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Users Who Have Rated Your Store</h2>
            
            {isLoading && <p className="text-indigo-600">Loading rater list...</p>}
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {raterList.map((rater, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rater.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rater.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-yellow-600">{rater.rating_value} ★</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(rater.submitted_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {raterList.length === 0 && !isLoading && <p className="p-4 text-gray-500">No ratings submitted yet.</p>}
            </div>
        </div>
    );
};

export default OwnerDashboard;