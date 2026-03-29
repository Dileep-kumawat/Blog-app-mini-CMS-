import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { registerUser, clearAuthError, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../redux/slices/authSlice';
import { usePageEnter } from '../hooks/useScrollAnimation';

const PasswordRule = ({ met, text }) => (
  <div className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-ink-400'}`}>
    {met ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
    {text}
  </div>
);

const Register = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error     = useSelector(selectAuthError);
  const isAuth    = useSelector(selectIsAuthenticated);

  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const pageRef = useRef(null);

  usePageEnter(pageRef);

  useEffect(() => { if (isAuth) navigate('/'); }, [isAuth, navigate]);
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const pwdRules = [
    { met: form.password.length >= 6,       text: 'At least 6 characters' },
    { met: /\d/.test(form.password),        text: 'Contains a number' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwdRules.some((r) => !r.met)) return toast.error('Please meet all password requirements');

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Welcome to Inkwell 🎉');
      navigate('/');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-2xl text-ink-950">
            Ink<span className="text-accent">well</span>
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink-950">
            Start your story
          </h1>
          <p className="mt-2 text-sm text-ink-500 font-body">
            Join thousands of writers on Inkwell
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-ink-700">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="input-field"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-ink-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-ink-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="input-field pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {form.password && (
                <div className="flex gap-4 pt-1">
                  {pwdRules.map((r) => <PasswordRule key={r.text} {...r} />)}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  Create account
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-500 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
