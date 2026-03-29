import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scroll and wires it to GSAP's ScrollTrigger.
 * Should be called once at the root level of the application.
 * Returns the Lenis instance so callers can scroll programmatically.
 */
export const useSmoothScroll = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration:   1.2,
      easing:     (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Keep GSAP's ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return lenisRef;
};

/**
 * Animate elements into view as they enter the viewport.
 * @param {React.RefObject} containerRef - parent ref to scope the query
 * @param {string} selector - CSS selector for target elements
 * @param {object} fromVars - GSAP from vars
 */
export const useScrollReveal = (containerRef, selector = '[data-reveal]', fromVars = {}) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      elements.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, ...fromVars },
          {
            opacity:  1,
            y:        0,
            duration: 0.7,
            delay:    i * 0.08,
            ease:     'power2.out',
            scrollTrigger: {
              trigger: el,
              start:   'top 88%',
              once:    true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, selector]);
};

/**
 * Fade + slide up on mount — for page transitions.
 */
export const usePageEnter = (ref) => {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, [ref]);
};
