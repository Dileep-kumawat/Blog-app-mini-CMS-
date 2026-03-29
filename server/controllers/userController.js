import User from '../models/User.js';
import Blog from '../models/Blog.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError('User not found', 404);

  const blogCount = await Blog.countDocuments({ author: user._id, published: true });

  res.json({ success: true, user, blogCount });
});

// ─── GET /api/users/:id/blogs ─────────────────────────────────────────────────
export const getUserBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError('User not found', 404);

  const [blogs, total] = await Promise.all([
    Blog.find({ author: req.params.id, published: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar'),
    Blog.countDocuments({ author: req.params.id, published: true }),
  ]);

  res.json({
    success: true,
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
