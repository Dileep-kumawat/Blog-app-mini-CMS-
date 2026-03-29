import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { addComment, deleteComment } from '../../redux/slices/blogSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import { getAvatarUrl, timeAgo } from '../../utils/helpers';

const CommentSection = ({ blog }) => {
  const dispatch   = useDispatch();
  const user       = useSelector(selectCurrentUser);
  const isAuth     = useSelector(selectIsAuthenticated);
  const [text, setText]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await dispatch(addComment({ blogId: blog._id, text: text.trim() })).unwrap();
      setText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await dispatch(deleteComment({ blogId: blog._id, commentId })).unwrap();
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-ink-100">
      {/* Header */}
      <h3 className="font-display text-xl font-semibold text-ink-900 mb-6 flex items-center gap-2">
        <MessageCircle size={20} className="text-accent" />
        {blog.comments?.length ?? 0} Comment{blog.comments?.length !== 1 ? 's' : ''}
      </h3>

      {/* Input form */}
      {isAuth ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3 items-start">
          <img
            src={getAvatarUrl(user)}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover border border-ink-200 flex-shrink-0 mt-0.5"
            onError={(e) => { e.target.src = getAvatarUrl({}); }}
          />
          <div className="flex-1 space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              maxLength={500}
              className="input-field resize-none text-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-400">{text.length}/500</span>
              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="btn-primary py-2 px-4 text-xs"
              >
                <Send size={13} />
                {loading ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-cream-100 rounded-xl text-sm text-ink-600 border border-ink-200">
          <Link to="/login" className="text-accent font-medium hover:underline">Log in</Link>
          {' '}to join the conversation.
        </div>
      )}

      {/* Comment list */}
      <div className="space-y-5">
        {blog.comments?.length === 0 && (
          <p className="text-sm text-ink-400 text-center py-8 font-body italic">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}

        {blog.comments?.map((comment) => {
          const isOwner    = user?._id === comment.user?._id;
          const isBlogAuth = user?._id === blog.author?._id;

          return (
            <div key={comment._id} className="flex gap-3 group">
              <Link to={`/profile/${comment.user?._id}`} className="flex-shrink-0">
                <img
                  src={getAvatarUrl(comment.user)}
                  alt={comment.user?.name}
                  className="w-9 h-9 rounded-full object-cover border border-ink-200"
                  onError={(e) => { e.target.src = getAvatarUrl({}); }}
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <Link
                      to={`/profile/${comment.user?._id}`}
                      className="text-sm font-semibold text-ink-800 hover:text-accent transition-colors"
                    >
                      {comment.user?.name}
                    </Link>
                    <span className="text-xs text-ink-400">{timeAgo(comment.createdAt)}</span>
                  </div>

                  {(isOwner || isBlogAuth) && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-ink-400 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <p className="mt-1 text-sm text-ink-600 leading-relaxed whitespace-pre-line">
                  {comment.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CommentSection;
