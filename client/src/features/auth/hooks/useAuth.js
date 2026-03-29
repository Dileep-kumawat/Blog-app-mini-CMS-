import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { register, login, logout, getMe } from '../apis/auth.api';
import {
    setUser,
    setInitialising,
    setLoading,
    setError,
} from '../authSlice';

export function useAuth() {
    const dispatch = useDispatch();

    const handleError = useCallback(
        (error) => {
            const { status, msg } = error ?? {};
            if (status === 401) {
                dispatch(setError('Invalid email or password'));
            } else if (status === 409) {
                dispatch(setError('An account with this email already exists'));
            } else if (status === 0) {
                dispatch(setError('Cannot reach the server — check your connection'));
            } else {
                dispatch(setError(msg || 'An unexpected error occurred'));
            }
        },
        [dispatch]
    );

    const handleRegister = useCallback(
        async ({ username, email, password }) => {
            dispatch(setLoading(true));
            dispatch(setError(null));
            try {
                const res = await register({ username, email, password });
                dispatch(setUser(res.user));
                return { success: true };
            } catch (error) {
                handleError(error);
                return { success: false };
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, handleError]
    );

    const handleLogin = useCallback(
        async ({ email, password }) => {
            dispatch(setLoading(true));
            dispatch(setError(null));
            try {
                const res = await login({ email, password });
                dispatch(setUser(res.user));
                return { success: true };
            } catch (error) {
                handleError(error);
                return { success: false };
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, handleError]
    );

    const handleGetMe = useCallback(async () => {
        dispatch(setInitialising(true));
        try {
            const res = await getMe();
            dispatch(setUser(res.user));
            return { success: true };
        } catch {
            dispatch(setUser(null));
            return { success: false };
        } finally {
            dispatch(setInitialising(false));
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            await logout();
            dispatch(setUser(null));
            return { success: true };
        } catch (error) {
            handleError(error);
            return { success: false };
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, handleError]);

    return { handleRegister, handleLogin, handleLogout, handleGetMe };
}