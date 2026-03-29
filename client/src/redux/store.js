import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    auth:  authReducer,
    blogs: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types that may carry non-serializable Date objects
        ignoredActions: ['auth/fetchMe/fulfilled', 'blogs/fetchAll/fulfilled'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});
