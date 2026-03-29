import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PenLine, FileText, Edit3, X, Check, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

import { userAPI } from '../services/api';
import { updateUserProfile, selectCurrentUser, selectIsAuthenticated } from '../redux/slices/authSlice';
import BlogCard from '../components/ui/BlogCard';
import { BlogCardSkeleton, ProfileSkeleton } from '../components/ui/Skeletons';
import Pagination from '../components/ui/Pagination';
import { getAvatarUrl, formatDate } from '../utils/helpers';
import { usePageEnter, useScrollReveal } from '../hooks/useScrollAnimation';

const Profile = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isAuth      = useSelector(selectIsAuthenticated);
  const isOwnProfile = currentUser?._id === id;

  const [profileUser,  setProfileUser]  = useState(null);
  const [blogs,        setBlogs]        = useState([]);
  const [pagination,   setPagination]   = useState(null);
  const [pageLoading,  setPageLoading]  = useState(true);
  const [blogLoading,  setBlogLoading]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [editMode,     setEditMode]     = useState(false);
  const [editForm,     setEditForm]     = useState({ name: '', bio: '', avatar: '' });
  const [saving,       setSaving]       = useState(false);

  const pageRef  = useRef(null);
  const gridRef  = useRef(null);

  usePageEnter(pageRef);
  useScrollReveal(gridRef);

  // Fetch user profile
  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      try {
        const { data } = await userAPI.getProfile(id);
        setProfileUser(data.user);
        setEditForm({ name: data.user.name, bio: data.user.bio || '', avatar: data.user.avatar || '' });
      } catch {
        toast.error('User not found');
        navigate('/');
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  // Fetch user's blogs
  useEffect(() => {
    if (!profileUser) return;
    const load = async () => {
      setBlogLoading(true);
      try {
        const { data } = await userAPI.getUserBlogs(id, { page, limit: 6 });
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } catch {
        toast.error('Failed to load stories');
      } finally {
        setBlogLoading(false);
      }
    };
    load();
  }, [id, profileUser, page]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return toast.error('Name is required');
    setSaving(true);
    const result = await dispatch(updateUserProfile(editForm));
    setSaving(false);
    if (updateUserProfile.fulfilled.match(result)) {
      setProfileUser(result.payload);
      setEditMode(false);
      toast.success('Profile updated!');
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  if (pageLoading) return <ProfileSkeleton />;
  if (!profileUser) return null;

  return (
    <div ref={pageRef} className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">

      {/* ── Profile hero ─────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={editMode ? (editForm.avatar || getAvatarUrl(profileUser)) : getAvatarUrl(profileUser)}
              alt={profileUser.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-ink-200 shadow-sm"
              onError={(e) => { e.target.src = getAvatarUrl({}); }}
            />
          </div>

          {/* Info / Edit form */}
          <div className="flex-1 min-w-0">
            {editMode ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 max-w-md">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  maxLength={50}
                  className="input-field text-sm"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Short bio (optional)"
                  rows={2}
                  maxLength={200}
                  className="input-field text-sm resize-none"
                />
                <input
                  type="url"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm((f) => ({ ...f, avatar: e.target.value }))}
                  placeholder="Avatar image URL (optional)"
                  className="input-field text-sm"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="btn-primary py-2 text-xs">
                    {saving ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Check size={13} /> Save</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="btn-secondary py-2 text-xs"
                  >
                    <X size={13} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-950">
                      {profileUser.name}
                    </h1>
                    <p className="text-sm text-ink-500 font-body mt-0.5">{profileUser.email}</p>
                  </div>

                  {isOwnProfile && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="btn-secondary text-xs flex-shrink-0"
                    >
                      <Edit3 size={13} /> Edit profile
                    </button>
                  )}
                </div>

                {profileUser.bio && (
                  <p className="mt-3 text-sm text-ink-600 font-body leading-relaxed max-w-lg">
                    {profileUser.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-4 flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-1.5 text-sm text-ink-500">
                    <FileText size={14} className="text-accent" />
                    <span className="font-medium text-ink-800">{pagination?.total ?? 0}</span>
                    {' '}stor{(pagination?.total ?? 0) !== 1 ? 'ies' : 'y'}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-ink-500">
                    <Calendar size={14} className="text-accent" />
                    Joined {formatDate(profileUser.createdAt)}
                  </div>
                </div>

                {isOwnProfile && isAuth && (
                  <div className="mt-5">
                    <Link to="/create" className="btn-primary text-xs">
                      <PenLine size={13} />
                      Write a new story
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-display text-xl font-semibold text-ink-900 flex-shrink-0">
          {isOwnProfile ? 'Your stories' : `Stories by ${profileUser.name.split(' ')[0]}`}
        </h2>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      {/* ── Blog grid ─────────────────────────────────────────────────────── */}
      <div ref={gridRef}>
        {blogLoading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🪶</div>
            <h3 className="font-display text-lg font-semibold text-ink-700 mb-1">
              {isOwnProfile ? "You haven't written anything yet" : 'No stories yet'}
            </h3>
            {isOwnProfile && (
              <p className="text-sm text-ink-400 mb-5">Your ideas deserve a home.</p>
            )}
            {isOwnProfile && (
              <Link to="/create" className="btn-primary">
                <PenLine size={15} /> Write your first story
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        )}
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />
    </div>
  );
};

export default Profile;
