import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  const getRange = () => {
    const delta = 2;
    const range = [];
    const left  = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < pages - 1) range.push('...');
    if (pages > 1) range.push(pages);
    return range;
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-ghost py-2 px-2 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getRange().map((item, i) =>
        item === '...' ? (
          <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-ink-400">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 ${
              item === page
                ? 'bg-accent text-white shadow-sm'
                : 'text-ink-600 hover:bg-cream-200'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn-ghost py-2 px-2 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
