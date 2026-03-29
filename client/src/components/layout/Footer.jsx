import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';

const Footer = () => (
  <footer className="mt-24 border-t border-ink-100 bg-cream-100/50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Link
        to="/"
        className="font-display font-bold text-lg text-ink-950 tracking-tight hover:text-accent transition-colors"
      >
        Ink<span className="text-accent">well</span>
      </Link>

      <p className="text-xs text-ink-400 font-body">
        © {new Date().getFullYear()} Inkwell. A place for writers.
      </p>

      <div className="flex items-center gap-4 text-xs text-ink-500 font-body">
        <Link to="/" className="hover:text-ink-800 transition-colors">Home</Link>
        <Link to="/create" className="hover:text-ink-800 transition-colors flex items-center gap-1">
          <PenLine size={12} /> Write
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
