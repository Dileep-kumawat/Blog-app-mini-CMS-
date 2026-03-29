import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogAPI } from '../../services/api';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await blogAPI.getAll(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blogs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await blogAPI.getById(id);
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, { rejectWithValue }) => {
    try {
      const { data } = await blogAPI.create(blogData);
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ id, data: blogData }, { rejectWithValue }) => {
    try {
      const { data } = await blogAPI.update(id, blogData);
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await blogAPI.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'blogs/toggleLike',
  async ({ blogId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await blogAPI.toggleLike(blogId);
      return { blogId, liked: data.liked, likeCount: data.likeCount, userId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'blogs/addComment',
  async ({ blogId, text }, { rejectWithValue }) => {
    try {
      const { data } = await blogAPI.addComment(blogId, { text });
      return { blogId, comment: data.comment, commentCount: data.commentCount };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'blogs/deleteComment',
  async ({ blogId, commentId }, { rejectWithValue }) => {
    try {
      const { data } = await blogAPI.deleteComment(blogId, commentId);
      return { blogId, commentId, commentCount: data.commentCount };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    items:      [],        // Blog list (feed)
    current:    null,      // Single blog being viewed
    pagination: null,
    isLoading:  false,
    isMutating: false,     // For create / update / delete actions
    error:      null,
  },
  reducers: {
    clearBlogError:   (state) => { state.error = null; },
    clearCurrentBlog: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    // ── fetchBlogs ────────────────────────────────────────────────────────
    builder
      .addCase(fetchBlogs.pending,   (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBlogs.fulfilled, (state, { payload }) => {
        state.items      = payload.blogs;
        state.pagination = payload.pagination;
        state.isLoading  = false;
      })
      .addCase(fetchBlogs.rejected,  (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });

    // ── fetchBlogById ─────────────────────────────────────────────────────
    builder
      .addCase(fetchBlogById.pending,   (state) => { state.isLoading = true; state.current = null; })
      .addCase(fetchBlogById.fulfilled, (state, { payload }) => {
        state.current   = payload;
        state.isLoading = false;
      })
      .addCase(fetchBlogById.rejected,  (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload;
      });

    // ── createBlog ────────────────────────────────────────────────────────
    builder
      .addCase(createBlog.pending,   (state) => { state.isMutating = true; state.error = null; })
      .addCase(createBlog.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
        state.isMutating = false;
      })
      .addCase(createBlog.rejected,  (state, { payload }) => {
        state.isMutating = false;
        state.error      = payload;
      });

    // ── updateBlog ────────────────────────────────────────────────────────
    builder
      .addCase(updateBlog.pending,   (state) => { state.isMutating = true; state.error = null; })
      .addCase(updateBlog.fulfilled, (state, { payload }) => {
        state.isMutating = false;
        state.current    = payload;
        const idx = state.items.findIndex((b) => b._id === payload._id);
        if (idx !== -1) state.items[idx] = payload;
      })
      .addCase(updateBlog.rejected,  (state, { payload }) => {
        state.isMutating = false;
        state.error      = payload;
      });

    // ── deleteBlog ────────────────────────────────────────────────────────
    builder
      .addCase(deleteBlog.pending,   (state) => { state.isMutating = true; })
      .addCase(deleteBlog.fulfilled, (state, { payload: id }) => {
        state.isMutating = false;
        state.items      = state.items.filter((b) => b._id !== id);
        if (state.current?._id === id) state.current = null;
      })
      .addCase(deleteBlog.rejected,  (state, { payload }) => {
        state.isMutating = false;
        state.error      = payload;
      });

    // ── toggleLike ────────────────────────────────────────────────────────
    builder.addCase(toggleLike.fulfilled, (state, { payload }) => {
      const { blogId, liked, likeCount, userId } = payload;

      const updateLikes = (blog) => {
        if (!blog || blog._id !== blogId) return;
        blog.likeCount = likeCount;
        if (liked) {
          if (!blog.likes.includes(userId)) blog.likes.push(userId);
        } else {
          blog.likes = blog.likes.filter((id) => id !== userId);
        }
      };

      updateLikes(state.current);
      const item = state.items.find((b) => b._id === blogId);
      updateLikes(item);
    });

    // ── addComment ────────────────────────────────────────────────────────
    builder.addCase(addComment.fulfilled, (state, { payload }) => {
      if (state.current?._id === payload.blogId) {
        state.current.comments.push(payload.comment);
        state.current.commentCount = payload.commentCount;
      }
    });

    // ── deleteComment ─────────────────────────────────────────────────────
    builder.addCase(deleteComment.fulfilled, (state, { payload }) => {
      if (state.current?._id === payload.blogId) {
        state.current.comments = state.current.comments.filter(
          (c) => c._id !== payload.commentId
        );
        state.current.commentCount = payload.commentCount;
      }
    });
  },
});

export const { clearBlogError, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectBlogs         = (state) => state.blogs.items;
export const selectCurrentBlog   = (state) => state.blogs.current;
export const selectPagination    = (state) => state.blogs.pagination;
export const selectBlogsLoading  = (state) => state.blogs.isLoading;
export const selectBlogsMutating = (state) => state.blogs.isMutating;
export const selectBlogsError    = (state) => state.blogs.error;
