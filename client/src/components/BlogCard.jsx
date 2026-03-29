import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSelector } from 'react-redux';
import { EditIcon, TrashIcon } from './Icons';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogCard = ({ blog, onEdit, onDelete, showActions = true }) => {
  const user = useSelector((s) => s.auth.user);

  const authorObj = typeof blog.author === 'object' ? blog.author : null;
  const authorId = (authorObj?._id ?? blog.author)?.toString();
  const authorName = authorObj?.username ?? 'Unknown';
  const authorInitials = authorName.slice(0, 2).toUpperCase();

  const isOwner = !!user && user._id?.toString() === authorId;

  return (
    <article
      className="group relative flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-amber-300 dark:hover:border-amber-800 hover:shadow-xl hover:shadow-stone-200/60 dark:hover:shadow-stone-950/60 transition-all duration-300"
      aria-label={`Blog post: ${blog.title}`}
    >
      {/* Amber accent bar on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="flex-1 p-6">

        {/* Author + date + actions row */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-ui font-semibold text-xs shrink-0"
            >
              {authorInitials}
            </div>
            <div>
              <p className="text-sm font-ui font-medium text-stone-800 dark:text-stone-200 leading-none mb-1">
                {authorName}
              </p>
              <time
                dateTime={blog.createdAt}
                className="text-xs font-ui text-stone-400 dark:text-stone-500"
              >
                {formatDate(blog.createdAt)}
              </time>
            </div>
          </div>

          {/* Owner actions — appear on hover */}
          {showActions && isOwner && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => onEdit?.(blog)}
                aria-label={`Edit "${blog.title}"`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => onDelete?.(blog._id)}
                aria-label={`Delete "${blog.title}"`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="font-display text-[1.2rem] font-semibold leading-snug text-stone-900 dark:text-stone-100 mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
          {blog.title}
        </h2>

        {/* Content preview — rendered Markdown, clamped */}
        <div className="blog-preview text-stone-500 dark:text-stone-400 text-sm font-body leading-relaxed prose-card">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3.5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
        <span
          aria-hidden="true"
          className="text-[11px] font-ui font-semibold uppercase tracking-widest text-amber-600/80 dark:text-amber-500/70"
        >
          Read more →
        </span>
      </div>
    </article>
  );
};

export default BlogCard;