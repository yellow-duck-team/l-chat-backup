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

// Rewrite the thumbnail size so grids can request small fast loads
const sized = (src, width) =>
  width && src ? src.replace(/([?&]sz=w)\d+/, `$1${width}`) : src;

// Image that loads through the shared limit and retries on error
// A slot is held while loading and freed on load, error or unmount
function DriveImage({ src, width, retries = 5, onLoad, onError, ...rest }) {
  const [url, setUrl] = useState(null);
  const attempt = useRef(0);
  const holding = useRef(false);
  const settled = useRef(false);

  const startLoad = () => {
    // The component unmounted while queued, hand the slot back
    if (settled.current) {
      release();
      return;
    }
    holding.current = true;
    setUrl(bust(sized(src, width), attempt.current));
  };

  const freeSlot = () => {
    if (holding.current) {
      holding.current = false;
      release();
    }
  };

  useEffect(() => {
    settled.current = false;
    attempt.current = 0;
    acquire(startLoad);
    return () => {
      settled.current = true;
      freeSlot();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const handleLoad = (e) => {
    settled.current = true;
    freeSlot();
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    freeSlot();
    if (attempt.current >= retries) {
      settled.current = true;
      if (onError) onError(e);
      return;
    }
    attempt.current += 1;
    // Re queue after a jittered delay so retries do not collide
    const wait = 500 * attempt.current + Math.random() * 700;
    setTimeout(() => {
      if (!settled.current) acquire(startLoad);
    }, wait);
  };

  return (
    <img
      src={url || undefined}
      onLoad={handleLoad}
      onError={handleError}
      {...rest}
    />
  );
}

export default DriveImage;
