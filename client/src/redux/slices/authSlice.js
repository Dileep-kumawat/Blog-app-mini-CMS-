import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.register(credentials);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.login(credentials);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.getMe();
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.updateProfile(profileData);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        null,
    isLoading:   false,
    initialized: false, // Whether we've checked the cookie on mount
    error:       null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // ── fetchMe (app bootstrap) ────────────────────────────────────────────
    builder
      .addCase(fetchMe.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user        = payload;
        state.isLoading   = false;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected,  (state) => {
        state.user        = null;
        state.isLoading   = false;
        state.initialized = true;
      });

    // ── register ──────────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending,   (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.user      = payload;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected,  (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });

    // ── login ─────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending,   (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user      = payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected,  (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });

    // ── logout ────────────────────────────────────────────────────────────
    builder
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; })

    // ── updateProfile ─────────────────────────────────────────────────────
    builder
      .addCase(updateUserProfile.pending,   (state) => { state.isLoading = true; })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.user      = payload;
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected,  (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectCurrentUser    = (state) => state.auth.user;
export const selectAuthLoading    = (state) => state.auth.isLoading;
export const selectAuthError      = (state) => state.auth.error;
export const selectAuthInitialized = (state) => state.auth.initialized;
export const selectIsAuthenticated = (state) => !!state.auth.user;
