import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useBlogs } from '../hooks/useBlog';
import Navbar from '../../../components/Navbar';
import Modal from '../../../components/Modal';
import ConfirmDialog from '../../../components/ConfirmDialog';
import BlogCard from '../../../components/BlogCard';
import { TextareaField, InputField } from '../../../components/FormFields';
import { PlusIcon } from '../../../components/Icons';

const BlogFormFields = ({ data, onChange, isSubmitting, submitLabel, onCancel }) => (
  <div className="space-y-4">
    <InputField
      label="Title"
      id="blog-title"
      value={data.title}
      onChange={(e) => onChange((p) => ({ ...p, title: e.target.value }))}
      placeholder="Give your story a compelling title…"
      required
    />
    <TextareaField
      label="Content"
      id="blog-content"
      hint="(Markdown supported)"
      value={data.content}
      onChange={(e) => onChange((p) => ({ ...p, content: e.target.value }))}
      placeholder={'Tell your story…\n\n**Bold**, *italic*, ## headings, `code`, > quotes — all supported.'}
      rows={10}
    />
    <div className="flex gap-3 pt-1">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-ui font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-ui font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div
              className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
              role="status"
              aria-label="Saving…"
            />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </div>
  </div>
);

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
      <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-4/6" />
    </div>
  </div>
);

const Home = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [createData, setCreateData] = useState({ title: '', content: '' });
  const [updateData, setUpdateData] = useState({ title: '', content: '' });

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const blogs = useSelector((s) => s.blog.blogs);
  const listLoading = useSelector((s) => s.blog.listLoading);
  const mutating = useSelector((s) => s.blog.mutating);

  const { handleGetBlogs, handleCreateBlog, handleUpdateBlog, handleDeleteBlog } = useBlogs();

  useEffect(() => {
    handleGetBlogs();
  }, [handleGetBlogs]);

  const handleCreate = useCallback(
    async (e) => {
      e.preventDefault();
      const { success } = await handleCreateBlog(createData);
      if (success) {
        setCreateData({ title: '', content: '' });
        setShowCreate(false);
      }
    },
    [createData, handleCreateBlog]
  );

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

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar onCreateBlog={() => setShowCreate(true)} />

      {/* ── Hero banner ── */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-ui font-bold uppercase tracking-widest rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" aria-hidden="true" />
              Live Feed
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-4">
              Fresh from<br />the Chronicle
            </h1>
            <p className="font-body text-stone-500 dark:text-stone-400 text-lg leading-relaxed">
              Stories, ideas, and perspectives from our community of writers.
            </p>
          </div>
        </div>
      </div>

      {/* ── Blog grid ── */}
      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12"
        aria-label="Blog posts feed"
      >
        {listLoading && blogs.length === 0 ? (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading posts…"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="w-8 h-8 text-amber-500"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-semibold text-stone-700 dark:text-stone-300 mb-2">
              No stories yet
            </h2>
            <p className="font-ui text-stone-400 dark:text-stone-500 mb-8 max-w-sm">
              The feed is empty. Be the first voice — write something that matters.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-ui font-semibold rounded-xl transition-colors text-sm"
            >
              Write your first post
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onEdit={openEdit}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Mobile FAB ── */}
      <button
        onClick={() => setShowCreate(true)}
        aria-label="Write new post"
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center transition-all active:scale-95"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* ── Create Modal ── */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Post"
        size="lg"
      >
        <form onSubmit={handleCreate}>
          <BlogFormFields
            data={createData}
            onChange={setCreateData}
            isSubmitting={mutating}
            submitLabel="Publish"
            onCancel={() => setShowCreate(false)}
          />
        </form>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal isOpen={showUpdate} onClose={closeUpdate} title="Edit Post" size="lg">
        <form onSubmit={handleUpdate}>
          <BlogFormFields
            data={updateData}
            onChange={setUpdateData}
            isSubmitting={mutating}
            submitLabel="Save changes"
            onCancel={closeUpdate}
          />
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

export default Home;