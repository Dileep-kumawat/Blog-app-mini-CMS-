import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, EyeOff, PenLine, ImagePlus, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { createBlog, selectBlogsMutating } from '../redux/slices/blogSlice';
import { parseTags } from '../utils/helpers';
import { usePageEnter } from '../hooks/useScrollAnimation';

const CreateBlog = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const isMutating = useSelector(selectBlogsMutating);

  const [form, setForm] = useState({
    title:       '',
    content:     '',
    coverImage:  '',
    tagInput:    '',
    tags:        [],
    excerpt:     '',
  });
  const [preview, setPreview] = useState(false);
  const pageRef = useRef(null);
  usePageEnter(pageRef);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addTag = () => {
    const newTags = parseTags(form.tagInput);
    const merged  = [...new Set([...form.tags, ...newTags])].slice(0, 8);
    setForm((f) => ({ ...f, tags: merged, tagInput: '' }));
  };

  const removeTag = (tag) => setField('tags', form.tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())   return toast.error('Title is required');
    if (!form.content.trim()) return toast.error('Content is required');

    const payload = {
      title:      form.title.trim(),
      content:    form.content.trim(),
      coverImage: form.coverImage.trim(),
      tags:       form.tags,
      excerpt:    form.excerpt.trim(),
    };

    const result = await dispatch(createBlog(payload));
    if (createBlog.fulfilled.match(result)) {
      toast.success('Blog published! 🎉');
      navigate(`/blog/${result.payload._id}`);
    } else {
      toast.error(result.payload || 'Failed to publish');
    }
  };

  return (
    <div ref={pageRef} className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-950">Write a story</h1>
          <p className="mt-1 text-sm text-ink-500 font-body">Share your ideas with the world</p>
        </div>
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="btn-secondary text-xs"
        >
          {preview ? <><EyeOff size={14} /> Editor</> : <><Eye size={14} /> Preview</>}
        </button>
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

        {/* Cover image URL */}
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
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full border border-ink-200 hover:bg-white transition-colors"
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
            <span className="text-ink-400 font-normal">(up to 8, comma separated)</span>
          </label>

          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span key={tag} className="tag-pill cursor-default group flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-ink-400 hover:text-red-500 transition-colors"
                  >
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
              placeholder="e.g. technology, design, life"
              className="input-field text-sm flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!form.tagInput.trim()}
              className="btn-secondary text-xs flex-shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-700">
            Excerpt
            <span className="text-ink-400 font-normal ml-1">(optional — auto-generated if blank)</span>
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setField('excerpt', e.target.value)}
            placeholder="A short summary of your story…"
            rows={2}
            maxLength={300}
            className="input-field text-sm resize-none"
          />
        </div>

        {/* Content — Editor vs Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-ink-700 flex items-center gap-2">
              <PenLine size={15} className="text-accent" />
              Content
              <span className="text-xs text-ink-400 font-normal">Markdown supported</span>
            </label>
            <span className="text-xs text-ink-400">{form.content.length} chars</span>
          </div>

          {preview ? (
            <div className="min-h-96 p-6 bg-white border border-ink-200 rounded-xl">
              {form.content ? (
                <article className="prose prose-ink max-w-none font-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="text-ink-400 italic text-sm">Nothing to preview yet…</p>
              )}
            </div>
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              placeholder={`# Your heading\n\nStart writing your story here…\n\nYou can use **bold**, *italic*, \`code\`, and [links](https://example.com).\n\n## Subheading\n\n> Blockquotes look great too.`}
              rows={20}
              className="input-field text-sm font-mono leading-relaxed resize-y"
              spellCheck
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-ink-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isMutating || !form.title.trim() || !form.content.trim()}
            className="btn-primary"
          >
            {isMutating ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <PenLine size={15} />
                Publish story
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
