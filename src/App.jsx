import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import UserStoreList from './pages/UserStoreList';
import OwnerDashboard from './pages/OwnerDashboard';
import ChangePasswordPage from './pages/ChangePasswordPage';

const NotFound = () => (
    <div className="text-center p-20 text-xl font-semibold">
        404 | Page Not Found. <Link to="/" className="text-indigo-600 hover:underline">Go Home</Link>
    </div>
);


function App() {
  const { user } = useSelector(state => state.auth);
  
  const getInitialRoute = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/admin/dashboard';
    if (user.role === 'StoreOwner') return '/owner/dashboard';
    return '/stores';
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="container mx-auto flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Navigate to={getInitialRoute()} replace />} />

            {/* Protected Routes (General Access) */}
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'NormalUser', 'StoreOwner']} />}>
              <Route path="/change-password" element={<ChangePasswordPage />} />
            </Route>

            {/* Role-Specific Routes */}
            <Route element={<ProtectedRoute allowedRoles={['NormalUser']} />}>
              <Route path="/stores" element={<UserStoreList />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['StoreOwner']} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;