import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, PlusIcon, LogoutIcon } from './Icons';

const Navbar = ({ onCreateBlog }) => {
  const { isDark, toggleTheme } = useTheme();
  const { handleLogout } = useAuth();
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    const { success } = await handleLogout();
    if (success) navigate('/login');
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '?';
  const isProfile = location.pathname === '/profile';

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-40 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-bold text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0"
        >
          The Chronicle
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* New Post button — desktop only */}
          {onCreateBlog && (
            <button
              onClick={onCreateBlog}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-ui font-medium rounded-lg transition-colors"
            >
              <PlusIcon />
              New Post
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Profile avatar */}
          <Link
            to="/profile"
            aria-label={`View profile for ${user?.username ?? 'user'}`}
            aria-current={isProfile ? 'page' : undefined}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-ui font-semibold text-sm transition-all ring-2 ${isProfile
                ? 'bg-amber-500 text-white ring-amber-500/30'
                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 ring-transparent hover:ring-amber-300 dark:hover:ring-amber-700'
              }`}
          >
            {initials}
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            aria-label="Log out"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-ui text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
          >
            <LogoutIcon />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;