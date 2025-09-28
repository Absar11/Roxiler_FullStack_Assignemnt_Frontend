import React, { useState } from 'react';
import { createAdminUser, fetchAdminUsers } from '../../features/admin/adminSlice';

const UserManagement = ({ userList, isLoading, dispatch }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NormalUser' });
    const [formStatus, setFormStatus] = useState(null); 
    const [formMessage, setFormMessage] = useState('');

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormStatus(null);
        setFormMessage('');
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('loading');
        
        try {
            const result = await dispatch(createAdminUser(formData)).unwrap();
            setFormStatus('success');
            setFormMessage(result);
            setFormData({ name: '', email: '', password: '', address: '', role: 'NormalUser' });
            dispatch(fetchAdminUsers()); 
        } catch (error) {
            setFormStatus('error');
            setFormMessage(error);
        }
    };

    const UserTable = ({ users }) => {
        const sortedUsers = users.sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name));
        
        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border">
                {isLoading && <p className="p-4 text-indigo-600">Loading list...</p>}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-100 text-red-800' : user.role === 'StoreOwner' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{user.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !isLoading && <p className="p-4 text-gray-500">No users found.</p>}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
                {isAdding ? 'Close Form' : 'Add New User'}
            </button>

            {isAdding && (
                <div className="p-6 bg-white rounded-lg shadow-lg border border-indigo-100 max-w-2xl">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Create New System User</h3>
                    {formStatus === 'success' && <p className="text-green-600 mb-3">{formMessage}</p>}
                    {formStatus === 'error' && <p className="text-red-600 mb-3">{formMessage}</p>}
                    
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} required placeholder="Name (20-60 chars)" className="w-full border px-3 py-2 rounded" />
                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} required placeholder="Email" className="w-full border px-3 py-2 rounded" />
                        <input type="password" name="password" value={formData.password} onChange={handleFormChange} required placeholder="Password (8-16 chars, special, uppercase)" className="w-full border px-3 py-2 rounded" />
                        <input type="text" name="address" value={formData.address} onChange={handleFormChange} required placeholder="Address (Max 400 chars)" className="w-full border px-3 py-2 rounded" />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role:</label>
                            <select name="role" value={formData.role} onChange={handleFormChange} required className="w-full border px-3 py-2 rounded bg-gray-50">
                                <option value="NormalUser">Normal User</option>
                                <option value="StoreOwner">Store Owner</option>
                                <option value="Admin">System Administrator</option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            disabled={formStatus === 'loading'}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            {formStatus === 'loading' ? 'Creating...' : 'Create User'}
                        </button>
                    </form>
                </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 pt-4">User List</h2>
            <UserTable users={userList} />
        </div>
    );
};

export default UserManagement;