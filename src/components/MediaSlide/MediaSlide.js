import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import DriveImage from 'components/DriveImage';
import './MediaSlide.css';

function MediaSlide({ media, openMedia }) {
  const [isLoading, setIsLoading] = useState(true);

  const onCloseMedia = () => {
    if (openMedia) {
      openMedia(false, null, '', 0, 0);
    }
  };

  // Hide the image with no layout space so only the spinner shows while loading
  const onSettle = () => setIsLoading(false);

  return (
    <div className="msg-img">
      {isLoading && <LoadingSpinner />}
      {media && (
        <DriveImage
          src={media.media}
          alt=""
          style={{ display: isLoading ? 'none' : undefined }}
          onLoad={onSettle}
          onError={onSettle}
        />
      )}
      <button onClick={onCloseMedia}>
        <CloseOutlined />
      </button>
    </div>
  );
}

export default MediaSlide;
