import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosBase from '../../api/axiosBase';

const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return { user: null, token: null };
    try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
            return { user: decodedUser, token };
        }
        localStorage.removeItem('token');
        return { user: null, token: null };
    } catch (error) {
        console.error(error.message)
        localStorage.removeItem('token');
        return { user: null, token: null };
    }
};

const { user, token } = decodeToken();

const initialState = {
    user: user,
    token: token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
};

// --- Async Thunks (API call definitions) ---
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosBase.post('/auth/login', credentials);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Login failed.');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosBase.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Registration failed.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        [loginUser, registerUser].forEach(thunk => {
            builder
                .addCase(thunk.pending, (state) => { state.isLoading = true; state.error = null; })
                .addCase(thunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
        });
        
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const { token } = action.payload;
            localStorage.setItem('token', token);
            state.token = token;
            state.user = jwtDecode(token);
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state) => { state.isLoading = false; state.error = null; });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;