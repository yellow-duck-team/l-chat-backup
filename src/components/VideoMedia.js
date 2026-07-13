import { useState } from 'react';

/**
 * Video component that plays inline
 * Sources load in order: R2 -> Contentful
 */
function VideoMedia({ sources = [] }) {
  const chain = sources.filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = chain[index];

  if (!src) return null;

  return (
    <div className="bubble video">
      <video
        // Renders the first frame so no separate poster is needed
        src={`${src}#t=0.1`}
        controls
        preload="metadata"
        onError={() => setIndex((n) => n + 1)}
      />
    </div>
  );
}

export default VideoMedia;
