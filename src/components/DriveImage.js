import React, { useEffect, useRef, useState } from 'react';

// Global limit on how many Drive images load at once
// Drive caps concurrent requests so we queue the rest
const MAX_CONCURRENT = 2;
let active = 0;
const waiting = [];

// Start as many queued loads as the limit allows
const pump = () => {
  while (active < MAX_CONCURRENT && waiting.length > 0) {
    active++;
    waiting.shift()();
  }
};

// Queue a load at the back
const acquire = (run) => {
  waiting.push(run);
  pump();
};

// Queue a load at the front so it runs before other waiting loads
const acquireFront = (run) => {
  waiting.unshift(run);
  pump();
};

const release = () => {
  if (active > 0) active--;
  pump();
};

// Cache buster forces a fresh request on each retry
const bust = (src, n) => {
  if (n === 0) return src;
  const sep = src.includes('?') ? '&' : '?';
  return `${src}${sep}r=${n}`;
};

// Rewrite the thumbnail size so grids can request small fast loads
const sized = (src, width) =>
  width && src ? src.replace(/([?&]sz=w)\d+/, `$1${width}`) : src;

// Image that loads through the shared limit and retries on error
// A priority image jumps the queue but the limit still caps concurrency
function DriveImage({
  src,
  fallback,
  width,
  priority = false,
  retries = 5,
  timeout = 10000,
  onLoad,
  onError,
  ...rest
}) {
  const [url, setUrl] = useState(null);
  const attempt = useRef(0);
  const holding = useRef(false);
  const settled = useRef(false);
  const onFallback = useRef(false);
  const timer = useRef(null);

  // Priority jumps ahead of other waiting loads, concurrency stays capped
  const enqueue = (run) => (priority ? acquireFront(run) : acquire(run));

  const freeSlot = () => {
    if (holding.current) {
      holding.current = false;
      release();
    }
  };

  const fail = () => {
    clearTimeout(timer.current);
    freeSlot();

    // Retry the same source a few times
    if (attempt.current < retries) {
      attempt.current += 1;
      const wait = 500 * attempt.current + Math.random() * 700;

      setTimeout(() => {
        if (!settled.current) enqueue(startLoad);
      }, wait);

      return;
    }

    // Swap to the fallback url once
    if (fallback && !onFallback.current) {
      onFallback.current = true;
      attempt.current = 0;
      enqueue(startLoad);

      return;
    }

    settled.current = true;

    if (onError) onError();
  };

  const startLoad = () => {
    // The component settled while queued, hand the slot back
    if (settled.current) {
      release();
      return;
    }

    holding.current = true;
    const base = onFallback.current ? fallback : src;
    setUrl(bust(sized(base, width), attempt.current));

    // Recover the slot if the request never loads or errors
    clearTimeout(timer.current);
    timer.current = setTimeout(fail, timeout);
  };

  const handleLoad = (e) => {
    clearTimeout(timer.current);
    settled.current = true;
    freeSlot();

    if (onLoad) onLoad(e);
  };

  useEffect(() => {
    if (!src) return undefined;

    settled.current = false;
    attempt.current = 0;
    onFallback.current = false;

    enqueue(startLoad);
    return () => {
      settled.current = true;
      clearTimeout(timer.current);
      freeSlot();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <img
      alt=""
      src={url || undefined}
      onLoad={handleLoad}
      onError={fail}
      {...rest}
    />
  );
}

export default DriveImage;
