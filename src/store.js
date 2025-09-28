import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import storeReducer from './features/store/storeSlice'; 
import adminReducer from './features/admin/adminSlice';
import ownerReducer from './features/owner/ownerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        stores: storeReducer,
        admin: adminReducer, 
        owner: ownerReducer, 
    },
    devTools: import.meta.env.NODE_ENV !== 'production',
});