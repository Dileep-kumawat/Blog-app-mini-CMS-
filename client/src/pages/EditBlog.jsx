import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, EyeOff, Save, X, Tag, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  fetchBlogById, updateBlog,
  selectCurrentBlog, selectBlogsLoading, selectBlogsMutating, clearCurrentBlog,
} from '../redux/slices/blogSlice';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { parseTags } from '../utils/helpers';
import { usePageEnter } from '../hooks/useScrollAnimation';

const EditBlog = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const blog       = useSelector(selectCurrentBlog);
  const user       = useSelector(selectCurrentUser);
  const isLoading  = useSelector(selectBlogsLoading);
  const isMutating = useSelector(selectBlogsMutating);

  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(false);
  const pageRef = useRef(null);
  usePageEnter(pageRef);

  // Fetch blog on mount
  useEffect(() => {
    dispatch(fetchBlogById(id));
    return () => dispatch(clearCurrentBlog());
  }, [dispatch, id]);

  // Pre-fill form once blog loads
  useEffect(() => {
    if (!blog) return;
    // Authorization guard
    if (blog.author?._id !== user?._id) {
      toast.error('Not authorized to edit this post');
      navigate(`/blog/${id}`);
      return;
    }
    setForm({
      title:      blog.title,
      content:    blog.content,
      coverImage: blog.coverImage || '',
      tags:       blog.tags || [],
      excerpt:    blog.excerpt || '',
      tagInput:   '',
      published:  blog.published,
    });
  }, [blog, user, id, navigate]);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addTag = () => {
    const newTags = parseTags(form.tagInput);
    const merged  = [...new Set([...form.tags, ...newTags])].slice(0, 8);
    setForm((f) => ({ ...f, tags: merged, tagInput: '' }));
  };

  const removeTag = (tag) => setField('tags', form.tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())   return toast.error('Title is required');
    if (!form.content.trim()) return toast.error('Content is required');

    const result = await dispatch(updateBlog({
      id,
      data: {
        title:      form.title.trim(),
        content:    form.content.trim(),
        coverImage: form.coverImage.trim(),
        tags:       form.tags,
        excerpt:    form.excerpt.trim(),
        published:  form.published,
      },
    }));

    if (updateBlog.fulfilled.match(result)) {
      toast.success('Changes saved!');
      navigate(`/blog/${id}`);
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  if (isLoading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-950">Edit story</h1>
          <p className="mt-1 text-sm text-ink-500 font-body">Update and republish your post</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-600 font-body cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setField('published', e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            Published
          </label>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="btn-secondary text-xs"
          >
            {preview ? <><EyeOff size={14} /> Editor</> : <><Eye size={14} /> Preview</>}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Your story title…"
            maxLength={120}
            className="w-full bg-transparent border-0 border-b-2 border-ink-200 focus:border-accent
                       font-display text-3xl sm:text-4xl font-bold text-ink-950 placeholder-ink-300
                       outline-none pb-3 transition-colors duration-200"
          />
          <div className="text-right text-xs text-ink-400 mt-1">{form.title.length}/120</div>
        </div>

        {/* Cover image */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <ImagePlus size={15} className="text-accent" />
            Cover image URL
            <span className="text-ink-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={form.coverImage}
            onChange={(e) => setField('coverImage', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="input-field text-sm"
          />
          {form.coverImage && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-ink-200 h-48">
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setField('coverImage', '')}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full border border-ink-200 hover:bg-white"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <Tag size={15} className="text-accent" />
            Tags
          </label>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span key={tag} className="tag-pill flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-ink-400 hover:text-red-500">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={form.tagInput}
              onChange={(e) => setField('tagInput', e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="e.g. technology, design"
              className="input-field text-sm flex-1"
            />
            <button type="button" onClick={addTag} disabled={!form.tagInput.trim()} className="btn-secondary text-xs">
              Add
            </button>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-700">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setField('excerpt', e.target.value)}
            placeholder="A short summary…"
            rows={2}
            maxLength={300}
            className="input-field text-sm resize-none"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink-700">Content (Markdown)</label>
            <span className="text-xs text-ink-400">{form.content.length} chars</span>
          </div>
          {preview ? (
            <div className="min-h-96 p-6 bg-white border border-ink-200 rounded-xl">
              <article className="prose prose-ink max-w-none font-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
              </article>
            </div>
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              rows={20}
              className="input-field text-sm font-mono leading-relaxed resize-y"
              spellCheck
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-ink-100">
          <button type="button" onClick={() => navigate(`/blog/${id}`)} className="btn-ghost text-sm">
            Cancel
          </button>
          <button type="submit" disabled={isMutating} className="btn-primary">
            {isMutating ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={15} /> Save changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
