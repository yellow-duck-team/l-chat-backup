import { useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

/**
 * Chat bubble component, blue version (past version).
 * @param {string} date chat date
 * @param {string} text chat text
 * @param {string} type type of the chat
 * @returns Chat bubble component
 */
function ChatBubbleBlue({ date, text, type }) {
  const imageName = date.year.slice(2) + date.month + date.date;

  const [isLoading, setIsLoading] = useState(true);

  // Show loading spinner until media is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  if (type === 'Image') {
    return (
      <>
        {isLoading && <LoadingSpinner />}
        <img
          className={`chat-img-blue ${isLoading && 'hidden'}`}
          src={require(`assets/vlive/media/${imageName}_${text}.JPG`)}
          alt=""
          onLoad={onMediaLoad}
        />
      </>
    );
  }

  if (type === 'Voice') {
    return (
      <div className="chat-voice-blue">
        <audio
          src={require(`assets/vlive/voice/${imageName}_${text}.m4a`)}
          controls
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return (
    <div
      className={`${type.includes('Eng') ? 'chat-eng' : ''} chat-bubble-blue`}
    >
      <p className="artist-name">이달의 소녀(LOONA)</p>
      <p>{text}</p>
    </div>
  );
}

export default ChatBubbleBlue;
