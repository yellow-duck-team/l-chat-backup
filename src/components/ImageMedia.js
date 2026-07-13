import { useEffect, useState } from 'react';

/**
 * Image component that loads images in order: R2 -> Contentful -> Placeholder
 */
function ImageMedia({ src, fallback, sources, onLoad, onError, ...rest }) {
  const chain = (sources || [src, fallback]).filter(Boolean);
  const chainKey = chain.join('|');
  const [index, setIndex] = useState(0);

  // Restart from the first source when the chain changes
  useEffect(() => {
    setIndex(0);
  }, [chainKey]);

  const url = chain[index];

  const handleError = () => {
    if (index < chain.length - 1) {
      setIndex(index + 1);
    } else if (onError) {
      onError();
    }
  };

  return (
    <img
      alt=""
      src={url || undefined}
      onLoad={onLoad}
      onError={handleError}
      {...rest}
    />
  );
}

export default ImageMedia;
