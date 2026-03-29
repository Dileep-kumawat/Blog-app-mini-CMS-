import User from '../models/User.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError('An account with this email already exists', 409);
  }

  const user = await User.create({ name, email, password });

  generateTokenAndSetCookie(res, user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user,
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password since it has `select: false` on the schema
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('Invalid email or password', 401);
  }

  generateTokenAndSetCookie(res, user._id);

  // Strip password from response
  user.password = undefined;

  res.json({
    success: true,
    message: 'Logged in successfully',
    user,
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError('User not found', 404);

  res.json({ success: true, user });
});

// ─── PUT /api/auth/update-profile ─────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, avatar },
    { new: true, runValidators: true }
  );

  res.json({ success: true, message: 'Profile updated', user });
});
