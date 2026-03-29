import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';
import { InputField, SubmitButton, ErrorBanner } from '../../../components/FormFields';
import { SunIcon, MoonIcon } from '../../../components/Icons';
import { clearError } from '../authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { handleRegister } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((s) => s.auth.error);
  const loading = useSelector((s) => s.auth.loading);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const set = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success } = await handleRegister(formData);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950">

      {/* ── Left editorial panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[46%] bg-stone-900 dark:bg-[#0a0908] p-12 relative overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 48px)',
          }}
        />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-amber-700/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <span className="font-display text-2xl font-bold text-amber-400 tracking-tight">
            The Chronicle
          </span>
        </div>

        <div className="relative space-y-5">
          <div className="w-10 h-0.5 bg-amber-500/60" />
          <blockquote className="font-display text-[2.1rem] font-semibold italic leading-tight text-stone-100">
            "Every great writer<br />was once a reader<br />who dared to begin."
          </blockquote>
          <p className="font-ui text-sm text-stone-500 leading-relaxed max-w-xs">
            Join thousands of writers sharing stories that matter. Your voice deserves an audience.
          </p>

          {/* Stats */}
          <div className="flex gap-8 pt-2">
            {[['Stories', '10k+'], ['Writers', '2k+'], ['Readers', '50k+']].map(
              ([label, count]) => (
                <div key={label}>
                  <div className="font-display text-xl font-bold text-amber-400">{count}</div>
                  <div className="text-xs font-ui text-stone-500 mt-0.5">{label}</div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="relative">
          <p className="text-stone-600 text-xs font-ui">
            © {new Date().getFullYear()} The Chronicle · All rights reserved
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-10 pt-6">
          <span className="lg:hidden font-display text-xl font-bold text-amber-600 dark:text-amber-400">
            The Chronicle
          </span>
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-md">

            <div className="mb-9">
              <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Start your story
              </h1>
              <p className="font-ui text-sm text-stone-500 dark:text-stone-400">
                Create your free account and join our community of writers
              </p>
            </div>

            <ErrorBanner message={error} />

            <form onSubmit={handleSubmit} className="space-y-4 mt-5" noValidate>
              <InputField
                label="Username"
                id="register-username"
                type="text"
                value={formData.username}
                onChange={set('username')}
                placeholder="your_handle"
                required
              />
              <InputField
                label="Email address"
                id="register-email"
                type="email"
                value={formData.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
              />
              <InputField
                label="Password"
                id="register-password"
                type="password"
                value={formData.password}
                onChange={set('password')}
                placeholder="At least 6 characters"
                required
              />

              <div className="pt-1">
                <SubmitButton
                  loading={loading}
                  label="Create account"
                  loadingLabel="Creating account…"
                />
              </div>
            </form>

            <p className="text-[11px] font-ui text-stone-400 dark:text-stone-600 text-center mt-4">
              By registering, you agree to our{' '}
              <span className="underline cursor-pointer hover:text-stone-600 dark:hover:text-stone-400">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="underline cursor-pointer hover:text-stone-600 dark:hover:text-stone-400">
                Privacy Policy
              </span>
            </p>

            <p className="mt-6 text-center text-sm font-ui text-stone-500 dark:text-stone-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-amber-600 dark:text-amber-400 hover:underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;