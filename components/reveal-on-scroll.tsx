'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reveals anything carrying `.reveal` once it reaches the trigger line.
 *
 * This is a position sweep rather than an IntersectionObserver on purpose:
 * deep links, restored scroll positions, backgrounded tabs and fast scrolling
 * can all skip an observer callback and strand content at opacity 0. A sweep
 * that asks "where is this element now?" cannot miss, and it never depends on
 * requestAnimationFrame alone — a tab that is not compositing stops serving
 * frames, and content must not disappear because of it.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (nodes.length === 0) return;

    let pending = nodes;
    let ticking = false;

    const sweep = () => {
      ticking = false;
      const line = window.innerHeight * 0.92;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top > line) return true;
        el.dataset.shown = 'true';
        return false;
      });
      if (pending.length === 0) teardown();
    };

    // rAF coalesces scroll bursts, but it must never be the only way sweep runs:
    // a throttled or non-compositing tab stops serving frames entirely, which
    // would latch `ticking` on and wedge the reveal for good. The timer both
    // guarantees the pass and releases the lock.
    const request = () => {
      if (ticking) return;
      ticking = true;
      let fallback = 0;
      const run = () => {
        window.clearTimeout(fallback);
        sweep();
      };
      fallback = window.setTimeout(run, 100);
      if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(run);
    };

    const onVisibility = () => {
      if (!document.hidden) sweep();
    };

    function teardown() {
      document.removeEventListener('scroll', request, true);
      window.removeEventListener('resize', request);
      window.removeEventListener('hashchange', sweep);
      window.removeEventListener('pageshow', sweep);
      document.removeEventListener('visibilitychange', onVisibility);
      timers.forEach((id) => window.clearTimeout(id));
    }

    // Capture phase so a scroll on any element reaches us, not just the window.
    document.addEventListener('scroll', request, { passive: true, capture: true });
    window.addEventListener('resize', request);
    window.addEventListener('hashchange', sweep);
    window.addEventListener('pageshow', sweep);
    document.addEventListener('visibilitychange', onVisibility);

    // Catch-up passes for anchor landings and late layout shifts. Every pass is
    // position-based, so they only ever reveal what is genuinely on screen.
    const timers = [0, 120, 400, 1000, 2200].map((delay) => window.setTimeout(sweep, delay));

    sweep();
    return teardown;
  }, [pathname]);

  return null;
}
