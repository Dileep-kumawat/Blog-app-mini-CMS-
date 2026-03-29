import api from '../../../app/api';

export async function getBlogs() {
    const res = await api.get('/api/blogs/');
    return res.data;
}

export async function getMyBlogs() {
    const res = await api.get('/api/blogs/mine');
    return res.data;
}

export async function createBlog({ title, content }) {
    const res = await api.post('/api/blogs/create', { title, content });
    return res.data;
}

export async function updateBlog(id, { title, content }) {
    const res = await api.patch(`/api/blogs/${id}`, { title, content });
    return res.data;
}

export async function deleteBlog(id) {
    const res = await api.delete(`/api/blogs/${id}`);
    return res.data;
}