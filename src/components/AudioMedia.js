import { useState } from 'react';
import { noSupport } from 'lib/constants';

/**
 * Audio component that loads audio in order: R2 -> Drive -> Contentful
 */
function AudioMedia({ sources = [], ...rest }) {
  const chain = sources.filter(Boolean);

  const [index, setIndex] = useState(0);

  const src = chain[index];

  if (!src) return null;

  return (
    <audio src={src} controls onError={() => setIndex((n) => n + 1)} {...rest}>
      {noSupport.audio}
    </audio>
  );
}

export default AudioMedia;
