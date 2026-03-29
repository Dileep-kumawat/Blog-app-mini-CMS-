import { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Heart, Edit2, Trash2, Clock, Eye, ArrowLeft, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import gsap from 'gsap';

import {
  fetchBlogById, deleteBlog, toggleLike,
  selectCurrentBlog, selectBlogsLoading, clearCurrentBlog,
} from '../redux/slices/blogSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../redux/slices/authSlice';
import { BlogDetailSkeleton } from '../components/ui/Skeletons';
import CommentSection from '../components/ui/CommentSection';
import { formatDate, readingTime, getAvatarUrl } from '../utils/helpers';

const BlogDetail = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const blog       = useSelector(selectCurrentBlog);
  const isLoading  = useSelector(selectBlogsLoading);
  const user       = useSelector(selectCurrentUser);
  const isAuth     = useSelector(selectIsAuthenticated);

  const heroRef    = useRef(null);
  const contentRef = useRef(null);

  const isOwner  = user && blog && user._id === blog.author?._id;
  const isLiked  = user && blog?.likes?.includes(user._id);

  useEffect(() => {
    dispatch(fetchBlogById(id));
    window.scrollTo({ top: 0 });
    return () => dispatch(clearCurrentBlog());
  }, [dispatch, id]);

  // GSAP: animate hero on load
  useEffect(() => {
    if (!blog || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.blog-hero-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [blog]);

  // GSAP: animate content paragraphs on scroll
  useEffect(() => {
    if (!blog || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power1.out', delay: 0.3 }
      );
    }, contentRef);
    return () => ctx.revert();
  }, [blog]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this story? This cannot be undone.')) return;
    const result = await dispatch(deleteBlog(id));
    if (deleteBlog.fulfilled.match(result)) {
      toast.success('Story deleted');
      navigate('/');
    } else {
      toast.error(result.payload || 'Delete failed');
    }
  };

  const handleLike = async () => {
    if (!isAuth) return toast.error('Log in to like stories');
    await dispatch(toggleLike({ blogId: id, userId: user._id }));
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: blog.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  if (isLoading) return <BlogDetailSkeleton />;

  if (!blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="text-5xl mb-4">📄</div>
      <h2 className="font-display text-2xl font-semibold text-ink-800 mb-2">Story not found</h2>
      <p className="text-sm text-ink-500 mb-6">It may have been deleted or made private.</p>
      <Link to="/" className="btn-primary"><ArrowLeft size={15} /> Back to home</Link>
    </div>
  );

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-20">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 transition-colors mb-8 group"
      >
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
        All stories
      </Link>

      {/* Hero */}
      <header ref={heroRef}>
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="blog-hero-item flex flex-wrap gap-1.5 mb-4">
            {blog.tags.map((tag) => (
              <Link key={tag} to={`/?tag=${tag}`} className="tag-pill">{tag}</Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="blog-hero-item font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink-950 leading-tight text-balance">
          {blog.title}
        </h1>

        {/* Meta row */}
        <div className="blog-hero-item mt-6 flex flex-wrap items-center gap-4">
          {/* Author */}
          <Link to={`/profile/${blog.author?._id}`} className="flex items-center gap-3 group">
            <img
              src={getAvatarUrl(blog.author)}
              alt={blog.author?.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-cream-200"
              onError={(e) => { e.target.src = getAvatarUrl({}); }}
            />
            <div>
              <p className="text-sm font-semibold text-ink-800 group-hover:text-accent transition-colors">
                {blog.author?.name}
              </p>
              <p className="text-xs text-ink-400">
                {formatDate(blog.createdAt)} · {readingTime(blog.content)}
              </p>
            </div>
          </Link>

          {/* Stats */}
          <div className="ml-auto flex items-center gap-3 text-ink-400">
            <span className="flex items-center gap-1 text-xs">
              <Eye size={13} />
              {blog.views ?? 0}
            </span>

            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all duration-200 ${
                isLiked
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-ink-200 text-ink-500 hover:border-red-200 hover:text-red-400'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-current' : ''} />
              {blog.likeCount ?? blog.likes?.length ?? 0}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full border border-ink-200 text-ink-400 hover:text-ink-700 hover:border-ink-300 transition-colors"
              title="Share"
            >
              <Share2 size={14} />
            </button>

            {/* Owner actions */}
            {isOwner && (
              <>
                <Link
                  to={`/blog/${id}/edit`}
                  className="p-1.5 rounded-full border border-ink-200 text-ink-400 hover:text-accent hover:border-accent/30 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full border border-ink-200 text-ink-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="mt-8 rounded-2xl overflow-hidden border border-ink-100">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full max-h-96 object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Content */}
      <div ref={contentRef} className="mt-10">
        <article className="prose prose-ink prose-lg max-w-none font-body
          prose-headings:font-display prose-headings:font-semibold
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-code:font-mono prose-code:text-sm
          prose-blockquote:border-accent prose-blockquote:font-display prose-blockquote:italic
          prose-img:rounded-xl prose-img:border prose-img:border-ink-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </article>
      </div>

      {/* Divider */}
      <div className="mt-12 flex items-center gap-4">
        <div className="h-px flex-1 bg-ink-100" />
        <span className="text-ink-300 text-lg">✦</span>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      {/* Author bio card */}
      <div className="mt-8 p-6 bg-cream-100 rounded-2xl border border-ink-100">
        <div className="flex items-start gap-4">
          <Link to={`/profile/${blog.author?._id}`} className="flex-shrink-0">
            <img
              src={getAvatarUrl(blog.author)}
              alt={blog.author?.name}
              className="w-14 h-14 rounded-xl object-cover border border-ink-200"
              onError={(e) => { e.target.src = getAvatarUrl({}); }}
            />
          </Link>
          <div>
            <p className="text-xs text-ink-400 font-body uppercase tracking-wide mb-1">Written by</p>
            <Link
              to={`/profile/${blog.author?._id}`}
              className="font-display font-semibold text-ink-900 hover:text-accent transition-colors"
            >
              {blog.author?.name}
            </Link>
            {blog.author?.bio && (
              <p className="mt-1 text-sm text-ink-500 font-body">{blog.author.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection blog={blog} />
    </article>
  );
};

export default BlogDetail;
