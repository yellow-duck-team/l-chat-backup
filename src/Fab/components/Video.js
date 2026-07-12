import { useState } from 'react';

/**
 * Video component
 * Sources load in order: R2 -> Bundled file
 */
function Video({ sources = [], ...rest }) {
  const chain = sources.filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = chain[index];

  if (!src) return null;

  return <video src={src} onError={() => setIndex((n) => n + 1)} {...rest} />;
}

export default Video;
