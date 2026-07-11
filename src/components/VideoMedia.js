import { useState } from 'react';

/**
 * Video component that plays inline from a real host
 * Sources load in order: R2 -> Contentful, Drive only opens a tab
 */
function VideoMedia({ sources = [], driveView = null }) {
  const chain = sources.filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = chain[index];

  // No inline host, a play box opens the Drive tab instead
  if (!src) {
    if (!driveView) return null;
    return (
      <div
        className="bubble video video-tab"
        onClick={() => window.open(driveView, '_blank', 'noopener')}
      >
        <span className="video-play" />
      </div>
    );
  }

  // The media fragment renders the first frame so no separate poster is needed
  return (
    <div className="bubble video">
      <video
        src={`${src}#t=0.1`}
        controls
        preload="metadata"
        onError={() => setIndex((n) => n + 1)}
      />
    </div>
  );
}

export default VideoMedia;
