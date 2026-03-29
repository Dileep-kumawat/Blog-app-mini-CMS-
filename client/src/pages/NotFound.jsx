import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const NotFound = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.nf-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
      <p className="nf-item font-mono text-8xl font-bold text-ink-200 select-none">404</p>
      <h1 className="nf-item font-display text-3xl font-bold text-ink-900 mt-4">
        Page not found
      </h1>
      <p className="nf-item mt-2 text-sm text-ink-500 max-w-sm">
        The page you're looking for doesn't exist, or has been moved.
      </p>
      <div className="nf-item mt-8 flex gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <button onClick={() => window.history.back()} className="btn-secondary">
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
