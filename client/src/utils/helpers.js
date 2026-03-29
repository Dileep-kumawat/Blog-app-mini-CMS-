/**
 * Format a date string into a readable form.
 * e.g. "March 15, 2024"
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });
};

/**
 * Format a date as relative time ("2 hours ago", "3 days ago").
 */
export const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  const intervals = [
    { label: 'year',   secs: 31536000 },
    { label: 'month',  secs: 2592000  },
    { label: 'week',   secs: 604800   },
    { label: 'day',    secs: 86400    },
    { label: 'hour',   secs: 3600     },
    { label: 'minute', secs: 60       },
  ];

  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

/**
 * Estimate reading time in minutes based on word count.
 */
export const readingTime = (text = '') => {
  const words = text.trim().split(/\s+/).length;
  const mins  = Math.ceil(words / 200);
  return `${mins} min read`;
};

/**
 * Generate an avatar URL using DiceBear or fall back to initials.
 */
export const getAvatarUrl = (user) => {
  if (user?.avatar) return user.avatar;
  const seed = encodeURIComponent(user?.name || 'user');
  return `https://api.dicebear.com/8.x/initials/svg?seed=${seed}&backgroundColor=c9622f&textColor=ffffff`;
};

/**
 * Truncate a string to maxLength characters, appending ellipsis.
 */
export const truncate = (str = '', maxLength = 120) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength).trimEnd() + '…';
};

/**
 * Convert a comma-separated tag string to a clean array.
 */
export const parseTags = (tagString = '') =>
  tagString
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
