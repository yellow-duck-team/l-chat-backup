import React, { useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { renderRichText } from 'Fab/components/RichText';
import 'Fab/pages/MessagePage.css';

/**
 * Message component that has styled text.
 * @param {*} chatId
 * @param {*} CSVText
 * @param {string} artistNum: number of current artist
 * @param {Function} onOpenMedia: function to open media modal when clicked
 * @returns Message component
 */
function Message({ chatId, CSVText, artistNum, onOpenMedia }) {
  const [isLoading, setIsLoading] = useState(true);

  // Show loading spinner until media is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  // Stylize message
  if (chatId === '' || !CSVText || CSVText === [] || CSVText.length === 0) {
    return <p></p>;
  }
  if (CSVText[0] === '') {
    // Message without anything
    return <p></p>;
  }
  // Video
  if (CSVText[0] === '(Video)') {
    const videoMedia = require(`assets/fab/${artistNum}/media/${
      chatId.length === 1 ? '0' + chatId : chatId
    }_0.mp4`);
    return (
      <div className="artist-msg video">
        {isLoading && <LoadingSpinner />}
        <video
          className={isLoading ? 'hidden' : ''}
          width="750"
          height="500"
          controls
          autoPlay
          onLoadedData={onMediaLoad}
        >
          <source src={videoMedia} type="video/mp4" />
        </video>
      </div>
    );
  }
  // Full Image
  if (CSVText[0] === '(Full Image)') {
    return (
      <div className="artist-msg full-img">
        {isLoading && <LoadingSpinner />}
        <img
          className={isLoading ? 'hidden' : ''}
          src={require(`assets/fab/${artistNum}/media/${
            chatId.length === 1 ? '0' + chatId : chatId
          }_0.jpg`)}
          alt=""
          onLoad={onMediaLoad}
        />
      </div>
    );
  }
  // If text or image text
  const msgText = renderRichText(
    artistNum,
    chatId,
    CSVText[0],
    isLoading,
    onOpenMedia,
    onMediaLoad
  );
  return <div className="msg-text">{msgText}</div>;
}

export default Message;
