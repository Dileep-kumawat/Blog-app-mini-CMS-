import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inkwell-blog-app.onrender.com/api',
  withCredentials: true, // Send HTTP-only cookies on every request
  headers: { 'Content-Type': 'application/json' },
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Normalize error messages so callers always get a plain string via error.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    // Attach normalized message so thunks can use rejectWithValue easily
    error.message = message;

    // Auto-redirect to login on 401 (token expired / not authenticated)
    if (error.response?.status === 401) {
      // Avoid redirect loops on the auth pages themselves
      const isAuthRoute = ['/login', '/register'].some((p) =>
        window.location.pathname.includes(p)
      );
      if (!isAuthRoute) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:        (data) => api.post('/auth/register', data),
  login:           (data) => api.post('/auth/login', data),
  logout:          ()     => api.post('/auth/logout'),
  getMe:           ()     => api.get('/auth/me'),
  updateProfile:   (data) => api.put('/auth/update-profile', data),
};

// ─── Blogs ────────────────────────────────────────────────────────────────────
export const blogAPI = {
  getAll:         (params) => api.get('/blogs', { params }),
  getById:        (id)     => api.get(`/blogs/${id}`),
  create:         (data)   => api.post('/blogs', data),
  update:         (id, data) => api.put(`/blogs/${id}`, data),
  remove:         (id)     => api.delete(`/blogs/${id}`),
  toggleLike:     (id)     => api.post(`/blogs/${id}/like`),
  addComment:     (id, data) => api.post(`/blogs/${id}/comments`, data),
  deleteComment:  (blogId, commentId) => api.delete(`/blogs/${blogId}/comments/${commentId}`),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:  (id)    => api.get(`/users/${id}`),
  getUserBlogs: (id, params) => api.get(`/users/${id}/blogs`, { params }),
};

export default api;
