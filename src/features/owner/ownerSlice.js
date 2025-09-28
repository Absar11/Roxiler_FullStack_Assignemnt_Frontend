import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosBase from '../../api/axiosBase';

const initialState = {
    averageRating: null,
    raterList: [],
    isLoading: false,
    error: null,
};

export const fetchOwnerAverageRating = createAsyncThunk(
    'owner/fetchAverageRating',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosBase.get('/stores/owner/average-rating');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to fetch average rating.');
        }
    }
);

export const fetchOwnerRaterList = createAsyncThunk(
    'owner/fetchRaterList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosBase.get('/stores/owner/ratings');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to fetch rater list.');
        }
    }
);

const ownerSlice = createSlice({
    name: 'owner',
    initialState,
    reducers: {
        clearOwnerError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOwnerAverageRating.fulfilled, (state, action) => {
                state.averageRating = action.payload.average_rating;
            })
            .addCase(fetchOwnerRaterList.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchOwnerRaterList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.raterList = action.payload;
            })
            .addCase(fetchOwnerRaterList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOwnerError } = ownerSlice.actions;
export default ownerSlice.reducer;