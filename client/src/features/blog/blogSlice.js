import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    blogs: [],
    listLoading: false,
    mutating: false,
    error: null,
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setBlogs(state, action) {
            state.blogs = action.payload;
        },
        addBlog(state, action) {
            state.blogs.unshift(action.payload);
        },
        updateBlogInState(state, action) {
            const updated = action.payload;
            const index = state.blogs.findIndex((b) => b._id === updated._id);
            if (index !== -1) state.blogs[index] = updated;
        },
        removeBlog(state, action) {
            state.blogs = state.blogs.filter((b) => b._id !== action.payload);
        },
        setListLoading(state, action) {
            state.listLoading = action.payload;
        },
        setMutating(state, action) {
            state.mutating = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    setBlogs,
    addBlog,
    updateBlogInState,
    removeBlog,
    setListLoading,
    setMutating,
    setError,
} = blogSlice.actions;

export default blogSlice.reducer;