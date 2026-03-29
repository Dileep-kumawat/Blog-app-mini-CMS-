import Blog from '../models/Blog.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

// ─── GET /api/blogs ───────────────────────────────────────────────────────────
export const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;
  const tag = req.query.tag;
  const search = req.query.search;

  const filter = { published: true };
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-content'), // Exclude full content from list views for performance
    Blog.countDocuments(filter),
  ]);

  res.json({
    success: true,
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  });
});

// ─── GET /api/blogs/:id ───────────────────────────────────────────────────────
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name avatar bio')
    .populate('comments.user', 'name avatar');

  if (!blog || !blog.published) throw new ApiError('Blog not found', 404);

  // Increment view count
  await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  res.json({ success: true, blog });
});

// ─── POST /api/blogs ──────────────────────────────────────────────────────────
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, coverImage, tags, excerpt } = req.body;

  const blog = await Blog.create({
    title,
    content,
    coverImage,
    tags,
    excerpt,
    author: req.user._id,
  });

  await blog.populate('author', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    blog,
  });
});

// ─── PUT /api/blogs/:id ───────────────────────────────────────────────────────
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError('Blog not found', 404);

  // Authorization: only the author can edit
  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to update this blog', 403);
  }

  const { title, content, coverImage, tags, excerpt, published } = req.body;

  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, content, coverImage, tags, excerpt, published },
    { new: true, runValidators: true }
  ).populate('author', 'name avatar');

  res.json({ success: true, message: 'Blog updated successfully', blog: updated });
});

// ─── DELETE /api/blogs/:id ────────────────────────────────────────────────────
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError('Blog not found', 404);

  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to delete this blog', 403);
  }

  await blog.deleteOne();

  res.json({ success: true, message: 'Blog deleted successfully' });
});

// ─── POST /api/blogs/:id/like ─────────────────────────────────────────────────
export const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError('Blog not found', 404);

  const userId = req.user._id;
  const isLiked = blog.likes.includes(userId);

  if (isLiked) {
    blog.likes.pull(userId);
  } else {
    blog.likes.push(userId);
  }

  await blog.save();

  res.json({
    success: true,
    liked: !isLiked,
    likeCount: blog.likes.length,
  });
});

// ─── POST /api/blogs/:id/comments ─────────────────────────────────────────────
export const addComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError('Blog not found', 404);

  const comment = {
    user: req.user._id,
    text: req.body.text,
  };

  blog.comments.push(comment);
  await blog.save();

  await blog.populate('comments.user', 'name avatar');

  const newComment = blog.comments[blog.comments.length - 1];

  res.status(201).json({
    success: true,
    message: 'Comment added',
    comment: newComment,
    commentCount: blog.comments.length,
  });
});

// ─── DELETE /api/blogs/:blogId/comments/:commentId ────────────────────────────
export const deleteComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.blogId);
  if (!blog) throw new ApiError('Blog not found', 404);

  const comment = blog.comments.id(req.params.commentId);
  if (!comment) throw new ApiError('Comment not found', 404);

  // Only comment author or blog author can delete
  const isCommentAuthor = comment.user.toString() === req.user._id.toString();
  const isBlogAuthor = blog.author.toString() === req.user._id.toString();

  if (!isCommentAuthor && !isBlogAuthor) {
    throw new ApiError('Not authorized to delete this comment', 403);
  }

  blog.comments.pull(req.params.commentId);
  await blog.save();

  res.json({
    success: true,
    message: 'Comment deleted',
    commentCount: blog.comments.length,
  });
});
