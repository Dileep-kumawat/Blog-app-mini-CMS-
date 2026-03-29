import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, PenLine, TrendingUp, Flame } from 'lucide-react';
import gsap from 'gsap';

import { fetchBlogs, selectBlogs, selectPagination, selectBlogsLoading } from '../redux/slices/blogSlice';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import BlogCard from '../components/ui/BlogCard';
import { BlogCardSkeleton } from '../components/ui/Skeletons';
import Pagination from '../components/ui/Pagination';
import { useScrollReveal } from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

const POPULAR_TAGS = ['technology', 'design', 'life', 'coding', 'travel', 'writing', 'science', 'culture'];

const Home = () => {
  const dispatch     = useDispatch();
  const blogs        = useSelector(selectBlogs);
  const pagination   = useSelector(selectPagination);
  const isLoading    = useSelector(selectBlogsLoading);
  const isAuth       = useSelector(selectIsAuthenticated);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const heroRef    = useRef(null);
  const gridRef    = useRef(null);
  const page       = parseInt(searchParams.get('page') || '1');
  const activeTag  = searchParams.get('tag') || '';

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch on param changes
  useEffect(() => {
    const params = { page, limit: 9 };
    if (activeTag)       params.tag    = activeTag;
    if (debouncedSearch) params.search = debouncedSearch;
    dispatch(fetchBlogs(params));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, page, activeTag, debouncedSearch]);

  // GSAP hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-content > *',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.1 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useScrollReveal(gridRef);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-10 w-64 h-64 rounded-full bg-cream-300/60 blur-2xl pointer-events-none" />

        <div className="hero-content relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-medium mb-5">
            <Flame size={12} />
            Stories worth reading
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink-950 leading-tight text-balance">
            Ideas that move
            <span className="italic text-accent"> the world.</span>
          </h1>

          <p className="mt-4 text-lg text-ink-500 font-body leading-relaxed max-w-lg">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>

          {/* Search */}
          <div className="mt-8 flex items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); }}
                placeholder="Search stories…"
                className="input-field pl-10 py-2.5"
              />
            </div>
            {isAuth && (
              <Link to="/create" className="btn-primary py-2.5 flex-shrink-0">
                <PenLine size={15} />
                Write
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Tag filter ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setParam('tag', '')}
            className={`tag-pill flex-shrink-0 ${!activeTag ? 'bg-accent text-white border-accent' : ''}`}
          >
            All posts
          </button>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setParam('tag', tag === activeTag ? '' : tag)}
              className={`tag-pill flex-shrink-0 ${activeTag === tag ? 'bg-accent text-white border-accent' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Blog grid ────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* Results info */}
        {!isLoading && pagination && (
          <div className="flex items-center gap-2 mb-6 text-sm text-ink-500">
            <TrendingUp size={14} className="text-accent" />
            {pagination.total === 0
              ? 'No stories found'
              : `${pagination.total} stor${pagination.total !== 1 ? 'ies' : 'y'}`}
            {(activeTag || debouncedSearch) && (
              <button
                onClick={() => { setSearch(''); setSearchParams({}); }}
                className="ml-1 text-accent hover:underline text-xs"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <div ref={gridRef}>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => <BlogCardSkeleton key={i} />)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="font-display text-xl font-semibold text-ink-800 mb-2">
                No stories here yet
              </h3>
              <p className="text-sm text-ink-400 mb-6">
                {isAuth ? 'Be the first to write something.' : 'Check back soon.'}
              </p>
              {isAuth && (
                <Link to="/create" className="btn-primary">
                  <PenLine size={15} />
                  Write the first story
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Featured first blog (large card) */}
              {page === 1 && !activeTag && !debouncedSearch && blogs[0] && (
                <div className="mb-6">
                  <BlogCard blog={blogs[0]} variant="featured" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(page === 1 && !activeTag && !debouncedSearch ? blogs.slice(1) : blogs).map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            </>
          )}
        </div>

        <Pagination
          pagination={pagination}
          onPageChange={(p) => {
            const next = new URLSearchParams(searchParams);
            next.set('page', p);
            setSearchParams(next);
          }}
        />
      </main>
    </div>
  );
};

export default Home;
