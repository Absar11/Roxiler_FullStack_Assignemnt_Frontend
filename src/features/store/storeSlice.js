import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosBase from '../../api/axiosBase';


export const fetchStores = createAsyncThunk(
    'stores/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosBase.get('/stores', { params }); 
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to fetch stores.');
        }
    }
);

export const submitRating = createAsyncThunk(
    'stores/submitRating',
    async ({ store_id, rating_value }, { rejectWithValue }) => {
        try {
            const response = await axiosBase.post('/stores/ratings', { store_id, rating_value }); 
            return { message: response.data.message, store_id, rating_value };
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to submit rating.');
        }
    }
);

const storeSlice = createSlice({
    name: 'stores',
    initialState: {
        list: [],
        isLoading: false,
        error: null,
        statusMessage: null, 
    },
    reducers: {
        clearStoreError: (state) => {
            state.error = null;
            state.statusMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload; 
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(submitRating.fulfilled, (state, action) => {
                state.statusMessage = action.payload.message;
                const { store_id, rating_value } = action.payload;
                const index = state.list.findIndex(store => store.store_id === store_id);
                if (index !== -1) {
                    state.list[index].user_submitted_rating = rating_value; 
                }
            })
            .addCase(submitRating.rejected, (state, action) => {
                 state.error = action.payload;
            });
    },
});

export const { clearStoreError } = storeSlice.actions;
export default storeSlice.reducer;