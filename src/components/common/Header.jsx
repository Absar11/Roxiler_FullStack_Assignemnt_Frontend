import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'Admin') return '/admin/dashboard';
        if (user.role === 'StoreOwner') return '/owner/dashboard';
        return '/stores';
    };

    return (
        <header className="bg-indigo-700 text-white shadow-lg fixed w-full z-10 top-0">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to={getDashboardLink()} className="text-2xl font-bold tracking-wider hover:text-white">
                    StoreRater
                </Link>
                
                <div className="flex items-center space-x-4">
                    {isAuthenticated && user ? (
                        <>
                            <span className="text-sm font-medium hidden sm:inline">
                                {user.role} | {user.name?.split(' ')[0]} 
                            </span>
                            
                            <Link 
                                to="/change-password" 
                                className="hover:text-indigo-200 transition text-sm"
                            >
                                Update Password
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-200 transition">
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded text-sm transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;