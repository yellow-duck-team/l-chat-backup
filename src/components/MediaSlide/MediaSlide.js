import { CloseOutlined } from '@ant-design/icons';
import './MediaSlide.css';

function MediaSlide({ media, openMedia }) {
  const onCloseMedia = () => {
    if (openMedia) {
      openMedia(false, null, '', 0, 0);
    }
  };

  return (
    <div className="msg-img">
      {media && <img src={media.media} alt="" />}
      <button onClick={onCloseMedia}>
        <CloseOutlined />
      </button>
    </div>
  );
}

export default MediaSlide;
