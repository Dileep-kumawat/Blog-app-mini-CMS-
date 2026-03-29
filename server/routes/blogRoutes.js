import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  deleteComment,
} from '../controllers/blogController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { blogRules, commentRules, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllBlogs);
router.get('/:id', optionalAuth, getBlogById);

// Protected routes
router.post('/', protect, blogRules, validate, createBlog);
router.put('/:id', protect, blogRules, validate, updateBlog);
router.delete('/:id', protect, deleteBlog);

// Like / Comment
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, commentRules, validate, addComment);
router.delete('/:blogId/comments/:commentId', protect, deleteComment);

export default router;
