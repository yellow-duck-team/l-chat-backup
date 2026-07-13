import { useEffect, useRef, useState } from 'react';

// Grows a visible count as a sentinel scrolls near the bottom
// Returns the count to render and a ref to place on the sentinel element
export const useInfiniteScroll = (total, step) => {
  const [visible, setVisible] = useState(step);
  const sentinelRef = useRef(null);

  // Reset the window when the data size changes
  useEffect(() => {
    setVisible(step);
  }, [total, step]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visible >= total) return undefined;

    // Observe inside the scrolling ancestor so its clipping is respected
    let root = el.parentElement;
    while (root && root !== document.body) {
      const oy = getComputedStyle(root).overflowY;
      if (oy === 'auto' || oy === 'scroll') break;
      root = root.parentElement;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + step, total));
        }
      },
      { root: root || null, rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, total, step]);

  return { visible, sentinelRef };
};
