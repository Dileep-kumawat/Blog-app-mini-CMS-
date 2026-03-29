import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getBlogs, getMyBlogs, createBlog, updateBlog, deleteBlog } from '../apis/blog.api';
import {
    setBlogs,
    addBlog,
    updateBlogInState,
    removeBlog,
    setListLoading,
    setMutating,
    setError,
} from '../blogSlice';

export function useBlogs() {
    const dispatch = useDispatch();

    const handleError = useCallback(
        (error) => {
            dispatch(setError(error?.msg || 'An unexpected error occurred'));
        },
        [dispatch]
    );

    const handleGetBlogs = useCallback(async () => {
        dispatch(setListLoading(true));
        dispatch(setError(null));
        try {
            const res = await getBlogs();
            dispatch(setBlogs(res.blogs));
            return { success: true };
        } catch (error) {
            handleError(error);
            return { success: false };
        } finally {
            dispatch(setListLoading(false));
        }
    }, [dispatch, handleError]);

    const handleGetMyBlogs = useCallback(async () => {
        dispatch(setListLoading(true));
        dispatch(setError(null));
        try {
            const res = await getMyBlogs();
            dispatch(setBlogs(res.blogs));
            return { success: true };
        } catch (error) {
            handleError(error);
            return { success: false };
        } finally {
            dispatch(setListLoading(false));
        }
    }, [dispatch, handleError]);

    const handleCreateBlog = useCallback(
        async (data) => {
            dispatch(setMutating(true));
            dispatch(setError(null));
            try {
                const res = await createBlog(data);
                dispatch(addBlog(res.blog));
                return { success: true };
            } catch (error) {
                handleError(error);
                return { success: false };
            } finally {
                dispatch(setMutating(false));
            }
        },
        [dispatch, handleError]
    );

    const handleUpdateBlog = useCallback(
        async (id, data) => {
            dispatch(setMutating(true));
            dispatch(setError(null));
            try {
                const res = await updateBlog(id, data);
                dispatch(updateBlogInState(res.blog));
                return { success: true };
            } catch (error) {
                handleError(error);
                return { success: false };
            } finally {
                dispatch(setMutating(false));
            }
        },
        [dispatch, handleError]
    );

    const handleDeleteBlog = useCallback(
        async (id) => {
            dispatch(setMutating(true));
            dispatch(setError(null));
            try {
                await deleteBlog(id);
                dispatch(removeBlog(id));
                return { success: true };
            } catch (error) {
                handleError(error);
                return { success: false };
            } finally {
                dispatch(setMutating(false));
            }
        },
        [dispatch, handleError]
    );

    return {
        handleGetBlogs,
        handleGetMyBlogs,
        handleCreateBlog,
        handleUpdateBlog,
        handleDeleteBlog,
    };
}