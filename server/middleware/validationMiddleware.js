import { body, validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/**
 * Runs after validation rules and converts any errors into a single
 * ApiError that the global error handler will format consistently.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    throw new ApiError(messages, 422);
  }
  next();
};

// ─── Auth Validation Rules ────────────────────────────────────────────────────

export const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
];

export const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

// ─── Blog Validation Rules ────────────────────────────────────────────────────

export const blogRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 120 }).withMessage('Title must be 3–120 characters'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
];

// ─── Comment Validation Rules ─────────────────────────────────────────────────

export const commentRules = [
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
];
