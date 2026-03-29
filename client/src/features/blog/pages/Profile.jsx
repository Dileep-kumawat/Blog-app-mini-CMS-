import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useBlogs } from '../hooks/useBlog';
import Navbar from '../../../components/Navbar';
import Modal from '../../../components/Modal';
import ConfirmDialog from '../../../components/ConfirmDialog';
import BlogCard from '../../../components/BlogCard';
import { InputField, TextareaField } from '../../../components/FormFields';
import { ArrowLeftIcon } from '../../../components/Icons';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-stone-200 dark:bg-stone-700 rounded-full" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-24" />
        <div className="h-2.5 bg-stone-100 dark:bg-stone-800 rounded w-16" />
      </div>
    </div>
    <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
    <div className="space-y-2">
      <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded" />
      <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-5/6" />
    </div>
  </div>
);

const Profile = () => {
  const user = useSelector((s) => s.auth.user);
  const blogs = useSelector((s) => s.blog.blogs);
  const listLoading = useSelector((s) => s.blog.listLoading);
  const mutating = useSelector((s) => s.blog.mutating);

  const [showUpdate, setShowUpdate] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [updateData, setUpdateData] = useState({ title: '', content: '' });

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const { handleGetMyBlogs, handleUpdateBlog, handleDeleteBlog } = useBlogs();

  useEffect(() => {
    handleGetMyBlogs();
  }, [handleGetMyBlogs]);

  const openEdit = useCallback((blog) => {
    setEditingBlog(blog);
    setUpdateData({ title: blog.title, content: blog.content });
    setShowUpdate(true);
  }, []);

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      const { success } = await handleUpdateBlog(editingBlog._id, updateData);
      if (success) {
        setShowUpdate(false);
        setEditingBlog(null);
      }
    },
    [editingBlog, updateData, handleUpdateBlog]
  );

  const closeUpdate = useCallback(() => {
    setShowUpdate(false);
    setEditingBlog(null);
  }, []);

  const requestDelete = useCallback((id) => {
    setConfirmDelete({ open: true, id });
  }, []);

  const confirmDeleteAction = useCallback(async () => {
    if (confirmDelete.id) await handleDeleteBlog(confirmDelete.id);
  }, [confirmDelete.id, handleDeleteBlog]);

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? '?';
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
    : null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar />

      {/* ── Profile Hero ── */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-ui text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-8 transition-colors"
          >
            <ArrowLeftIcon />
            Back to feed
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Avatar */}
            <div
              aria-hidden="true"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-display text-3xl font-bold shadow-lg shadow-amber-200 dark:shadow-amber-900/40 shrink-0"
            >
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100 mb-1">
                {user?.username ?? 'Writer'}
              </h1>
              <p className="font-ui text-stone-500 dark:text-stone-400 text-sm mb-4">
                {user?.email}
                {joinDate && (
                  <span className="ml-3 pl-3 border-l border-stone-200 dark:border-stone-700">
                    Joined {joinDate}
                  </span>
                )}
              </p>

              {/* Stats row */}
              <div className="flex gap-6">
                <div className="text-center sm:text-left">
                  <div className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
                    {blogs.length}
                  </div>
                  <div className="text-xs font-ui text-stone-400 mt-0.5">Posts</div>
                </div>
                {[['Readers', 'coming soon'], ['Following', 'coming soon']].map(([label, badge]) => (
                  <div key={label} className="text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 mt-0.5">
                      <span className="font-display text-xl font-bold text-stone-300 dark:text-stone-700">
                        —
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-ui text-stone-400">{label}</span>
                      <span className="text-[10px] font-ui font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full">
                        {badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Posts section ── */}
      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12"
        aria-label="My published posts"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
              My Posts
            </h2>
            <p className="font-ui text-sm text-stone-400 dark:text-stone-500 mt-1">
              {blogs.length > 0
                ? `${blogs.length} post${blogs.length === 1 ? '' : 's'} published`
                : 'No posts yet'}
            </p>
          </div>
        </div>

        {listLoading && blogs.length === 0 ? (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading your posts…"
          >
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="w-7 h-7 text-amber-500"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-stone-600 dark:text-stone-400 mb-2">
              Nothing published yet
            </h3>
            <p className="font-ui text-sm text-stone-400 mb-6">
              Head to the feed and write your first story.
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-ui font-medium rounded-xl transition-colors text-sm"
            >
              Go to feed
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onEdit={openEdit}
                onDelete={requestDelete}
                showActions
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Edit Modal ── */}
      <Modal isOpen={showUpdate} onClose={closeUpdate} title="Edit Post" size="lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <InputField
            label="Title"
            id="profile-edit-title"
            value={updateData.title}
            onChange={(e) => setUpdateData((p) => ({ ...p, title: e.target.value }))}
            placeholder="Post title"
            required
          />
          <TextareaField
            label="Content"
            id="profile-edit-content"
            hint="(Markdown supported)"
            value={updateData.content}
            onChange={(e) => setUpdateData((p) => ({ ...p, content: e.target.value }))}
            placeholder="Your story…"
            rows={10}
          />
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeUpdate}
              className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-ui font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutating}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-ui font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {mutating ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                    role="status"
                    aria-label="Saving…"
                  />
                  Saving…
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation ── */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={confirmDeleteAction}
        title="Delete post?"
        message="This action cannot be undone. The post will be permanently removed."
        confirmLabel="Delete post"
        danger
      />
    </div>
  );
};

export default Profile;