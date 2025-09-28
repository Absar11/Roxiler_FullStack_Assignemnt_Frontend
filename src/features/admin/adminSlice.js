import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosBase from '../../api/axiosBase';

const initialState = {
    stats: {},
    userList: [],
    isLoading: false,
    error: null,
};

export const fetchAdminStats = createAsyncThunk(
    'admin/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosBase.get('/admin/dashboard-stats');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to fetch admin stats.');
        }
    }
);

export const fetchAdminUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosBase.get('/admin/users', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to fetch user list.');
        }
    }
);

export const createAdminUser = createAsyncThunk(
    'admin/createUser',
    async (userData, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosBase.post('/admin/users', userData);
            dispatch(fetchAdminUsers()); 
            return response.data.message || 'User created successfully.';
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'User creation failed.');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.fulfilled, (state, action) => { state.stats = action.payload; })
            .addCase(fetchAdminUsers.pending, (state) => { state.isLoading = true; })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userList = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.error = null; })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.error = action.payload; });
    },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;