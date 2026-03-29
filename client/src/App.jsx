import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { fetchMe, selectAuthInitialized } from './redux/slices/authSlice';
import { useSmoothScroll } from './hooks/useScrollAnimation';

import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Home       from './pages/Home';
import Login      from './pages/Login';
import Register   from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import EditBlog   from './pages/EditBlog';
import BlogDetail from './pages/BlogDetail';
import Profile    from './pages/Profile';
import NotFound   from './pages/NotFound';

// Pages that should not show the footer
const NO_FOOTER_PATHS = ['/login', '/register'];

const App = () => {
  const dispatch     = useDispatch();
  const initialized  = useSelector(selectAuthInitialized);
  const location     = useLocation();

  // Initialize Lenis smooth scroll
  useSmoothScroll();

  // On mount: verify cookie and hydrate user state
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const showFooter = !NO_FOOTER_PATHS.includes(location.pathname);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="font-body text-sm text-ink-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize:   '13px',
            borderRadius: '12px',
            border:     '1px solid #e8e6e0',
            background: '#fdfcf8',
            color:      '#433b35',
            boxShadow:  '0 4px 20px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: { primary: '#c9622f', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/"              element={<Home />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/blog/:id"      element={<BlogDetail />} />
            <Route path="/profile/:id"   element={<Profile />} />

            {/* Protected routes */}
            <Route path="/create" element={
              <ProtectedRoute><CreateBlog /></ProtectedRoute>
            } />
            <Route path="/blog/:id/edit" element={
              <ProtectedRoute><EditBlog /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {showFooter && <Footer />}
      </div>
    </>
  );
};

export default App;
