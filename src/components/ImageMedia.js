import React, { useEffect, useRef, useState } from 'react';

// Limit on how many Drive images load at once
const MAX_CONCURRENT = 2;
let active = 0;
const waiting = [];

// Start as many queued Drive loads as the limit allows
const pump = () => {
  while (active < MAX_CONCURRENT && waiting.length > 0) {
    active++;
    waiting.shift()();
  }
};

const acquire = (run) => {
  waiting.push(run);
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

// Rewrite the thumbnail size for grids (only affects Drive thumbnail urls)
const sized = (src, width) =>
  width && src ? src.replace(/([?&]sz=w)\d+/, `$1${width}`) : src;

// If the source is a Drive url
const isDrive = (url) => !!url && url.includes('drive.google.com');

/**
 * Image component that loads images in order: R2 -> Drive -> Contentful
 * Only Drive goes through the shared limit and retry, others load in parallel
 */
function ImageMedia({
  src,
  fallback,
  sources,
  width,
  priority = false,
  retries = 5,
  timeout = 10000,
  onLoad,
  onError,
  ...rest
}) {
  const chain = (sources || [src, fallback]).filter(Boolean);
  const chainKey = chain.join('|');
  const [url, setUrl] = useState(null);
  const index = useRef(0);
  const attempt = useRef(0);
  const holding = useRef(false);
  const settled = useRef(false);
  const timer = useRef(null);

  // Google Drive - Wait foor a shared slot
  const capped = (source) => isDrive(source) && !priority;

  const freeSlot = () => {
    if (holding.current) {
      holding.current = false;
      release();
    }
  };

  const fail = () => {
    clearTimeout(timer.current);
    freeSlot();

    const current = chain[index.current];

    // Retry a throttled Drive source a few times
    if (isDrive(current) && attempt.current < retries) {
      attempt.current += 1;
      const wait = 500 * attempt.current + Math.random() * 700;

      setTimeout(() => {
        if (!settled.current) begin();
      }, wait);

      return;
    }

    // Move on to the next source
    if (index.current < chain.length - 1) {
      index.current += 1;
      attempt.current = 0;
      begin();

      return;
    }

    settled.current = true;

    if (onError) onError();
  };

  // Point the img at the current source
  const startLoad = () => {
    const source = chain[index.current];

    if (settled.current) {
      if (capped(source)) {
        release();
      }

      return;
    }

    if (capped(source)) {
      holding.current = true;
    }

    setUrl(bust(sized(source, width), attempt.current));
    clearTimeout(timer.current);

    // Google Drive - Guard with a timeout
    if (capped(source)) {
      timer.current = setTimeout(fail, timeout);
    }
  };

  // Begin media loading
  const begin = () => {
    if (settled.current) {
      return;
    }

    if (capped(chain[index.current])) {
      // Google Drive - Wait for a slot
      acquire(startLoad);
    } else {
      // R2/Contentful - Start loading now
      startLoad();
    }
  };

  const handleLoad = (e) => {
    clearTimeout(timer.current);
    settled.current = true;
    freeSlot();

    if (onLoad) {
      onLoad(e);
    }
  };

  useEffect(() => {
    if (chain.length === 0) return undefined;

    settled.current = false;
    index.current = 0;
    attempt.current = 0;

    begin();
    return () => {
      settled.current = true;
      clearTimeout(timer.current);
      freeSlot();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainKey]);

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

export default ImageMedia;
