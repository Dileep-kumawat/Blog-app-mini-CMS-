import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, PenLine, LogOut, User, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import gsap from 'gsap';

import { logoutUser } from '../../redux/slices/authSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import { getAvatarUrl } from '../../utils/helpers';

const Navbar = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const user        = useSelector(selectCurrentUser);
  const isAuth      = useSelector(selectIsAuthenticated);

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const navRef      = useRef(null);
  const dropdownRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/');
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive ? 'text-accent' : 'text-ink-600 hover:text-ink-900'
    }`;

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-md border-b border-ink-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-bold text-xl text-ink-950 tracking-tight hover:text-accent transition-colors"
        >
          Ink<span className="text-accent">well</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          {isAuth && (
            <NavLink to="/create" className={navLinkClass}>Write</NavLink>
          )}
        </div>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-3">
          {isAuth ? (
            <>
              <Link to="/create" className="btn-primary text-xs py-2 px-4">
                <PenLine size={14} />
                New Post
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-ink-100 transition-colors"
                >
                  <img
                    src={getAvatarUrl(user)}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-ink-200"
                    onError={(e) => { e.target.src = getAvatarUrl({}); }}
                  />
                  <span className="text-sm font-medium text-ink-800 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown size={14} className={`text-ink-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-ink-100 shadow-lg py-1 z-50 animate-fade-in">
                    <Link
                      to={`/profile/${user?._id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-cream-100 transition-colors"
                    >
                      <User size={15} className="text-ink-400" />
                      Profile
                    </Link>
                    <div className="my-1 border-t border-ink-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs">Log in</Link>
              <Link to="/register" className="btn-primary text-xs py-2 px-4">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-ink-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-cream-50/98 backdrop-blur-md border-t border-ink-100 animate-slide-up">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-cream-200 text-accent' : 'text-ink-700 hover:bg-cream-100'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>

            {isAuth ? (
              <>
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-cream-200 text-accent' : 'text-ink-700 hover:bg-cream-100'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  Write
                </NavLink>
                <Link
                  to={`/profile/${user?._id}`}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-cream-100 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <div className="mt-2 pt-2 border-t border-ink-100">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  className="btn-secondary flex-1 justify-center text-xs"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary flex-1 justify-center text-xs"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
