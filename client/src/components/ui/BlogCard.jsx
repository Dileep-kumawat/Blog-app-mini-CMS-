import { Link } from 'react-router-dom';
import { Clock, Heart, MessageCircle, Eye } from 'lucide-react';
import { formatDate, readingTime, getAvatarUrl, truncate } from '../../utils/helpers';

const BlogCard = ({ blog, variant = 'default' }) => {
  const isFeature = variant === 'featured';

  return (
    <article
      className={`card group overflow-hidden flex flex-col ${isFeature ? 'md:flex-row' : ''}`}
      data-reveal
    >
      {/* Cover image */}
      {blog.coverImage && (
        <Link
          to={`/blog/${blog._id}`}
          className={`block overflow-hidden flex-shrink-0 ${
            isFeature ? 'md:w-2/5 h-52 md:h-auto' : 'h-48'
          }`}
        >
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/blog/${blog._id}`} className="block group/title">
          <h2
            className={`font-display font-semibold text-ink-950 leading-snug
              group-hover/title:text-accent transition-colors duration-200
              ${isFeature ? 'text-2xl' : 'text-lg'}`}
          >
            {blog.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-sm text-ink-500 font-body leading-relaxed line-clamp-3">
            {truncate(blog.excerpt, isFeature ? 200 : 120)}
          </p>
        )}

        {/* Footer row */}
        <div className="mt-auto pt-3 border-t border-ink-50 flex items-center justify-between">
          {/* Author */}
          <Link
            to={`/profile/${blog.author?._id}`}
            className="flex items-center gap-2.5 group/author min-w-0"
          >
            <img
              src={getAvatarUrl(blog.author)}
              alt={blog.author?.name}
              className="w-7 h-7 rounded-full object-cover border border-ink-200 flex-shrink-0"
              onError={(e) => { e.target.src = getAvatarUrl({}); }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-ink-700 group-hover/author:text-accent transition-colors truncate">
                {blog.author?.name}
              </p>
              <p className="text-xs text-ink-400">{formatDate(blog.createdAt)}</p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-3 text-ink-400 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs">
              <Clock size={12} />
              {readingTime(blog.content || blog.excerpt || '')}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Heart size={12} />
              {blog.likeCount ?? blog.likes?.length ?? 0}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <MessageCircle size={12} />
              {blog.commentCount ?? blog.comments?.length ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
