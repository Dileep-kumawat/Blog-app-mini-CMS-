import { verifyToken } from '../utils/generateToken.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    throw new ApiError('Not authenticated. Please log in.', 401);
  }

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError('The user belonging to this token no longer exists.', 401);
  }

  req.user = user;
  next();
});

/**
 * Optional auth — attaches user to req if a valid token exists,
 * but does not block the request if there is none.
 * Used for public routes that benefit from knowing who's requesting.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id);
    } catch {
      // Token invalid — continue as unauthenticated
    }
  }
  next();
});
