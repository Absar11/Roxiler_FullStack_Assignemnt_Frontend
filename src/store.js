import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import storeReducer from './features/store/storeSlice'; 

export const store = configureStore({
    reducer: {
        auth: authReducer,
        stores: storeReducer,
    },
    devTools: import.meta.env.NODE_ENV !== 'production',
});