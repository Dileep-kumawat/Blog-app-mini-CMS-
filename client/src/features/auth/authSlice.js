import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    initialising: true,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setInitialising(state, action) {
            state.initialising = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const { setUser, setInitialising, setLoading, setError, clearError } =
    authSlice.actions;

export default authSlice.reducer;