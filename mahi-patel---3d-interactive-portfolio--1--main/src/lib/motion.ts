import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Site-wide motion helpers:
 *  - useSmoothScroll: inertial smooth scrolling (Lenis) for mouse wheels / trackpads
 *  - useScrollReveal: fades elements marked `data-reveal` in as they enter the viewport
 *  - scrollToTop / smoothScrollTo: scroll helpers that cooperate with Lenis
 * Everything is skipped when the visitor prefers reduced motion.
 */

let lenis: Lenis | null = null;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: easeOutExpo,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      autoRaf: true,
    });
    lenis = instance;
    return () => {
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);
}

/** Jump to the top instantly (used on page changes). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

/** Glide to an element, leaving room for the fixed navbar. */
export function smoothScrollTo(el: HTMLElement | null, offset = -96) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4, easing: easeOutExpo });
  else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

/**
 * Reveal `[data-reveal]` elements on scroll. Optional `data-reveal-delay="120"` (ms)
 * staggers siblings. Re-scans whenever `key` changes (e.g. on page change) and
 * picks up elements added later.
 */
export function useScrollReveal(key: string) {
  useEffect(() => {
    const revealAll = () =>
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
          el.classList.add('is-revealed');
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches('[data-reveal]:not(.is-revealed)')) io.observe(root);
      root.querySelectorAll?.('[data-reveal]:not(.is-revealed)').forEach((el) => io.observe(el));
    };
    scan(document);

    const mo = new MutationObserver((mutations) =>
      mutations.forEach((m) => m.addedNodes.forEach((n) => n instanceof HTMLElement && scan(n)))
    );
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [key]);
}
