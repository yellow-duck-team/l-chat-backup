import React, { useEffect, useState } from 'react';
import { parseDate } from 'lib/date';
import '../pages/ChatPage.css';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const mentionedText = (text) => {
  if (!text.includes('@ ')) return errorText(text);
  let textList = text.split('@ ');
  if (textList[0].slice(-1) === '@') {
    return (
      <span>
        {`${textList[0]}@ `}
        {mentionedText(textList[1])}
      </span>
    );
  }
  return (
    <span>
      {textList[0]}
      <span className="mention select-none">오빛 </span>
      {mentionedText(textList[1])}
    </span>
  );
};

const errorText = (text) => {
  if (text.includes('####')) {
    return newLine(text.split('####').join());
  }
  return newLine(text);
};

const newLine = (text) => {
  if (text === '') return <p>{text}</p>;
  return text.split('\n').map((str, index) =>
    index < text.length - 1 ? (
      <span key={`fromm-newline-${index}`}>
        {str}
        <br />
      </span>
    ) : (
      <span key={`fromm-newline-${index}`}>{str}</span>
    )
  );
};

function ChatBubble({ dateStr, artistNum, text, type }) {
  const [ImageName, setImageName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dateStr) return;
    const date = parseDate(dateStr);
    setImageName(date.year.slice(2) + date.month + date.date);
  }, [dateStr]);

  // Show loading spinner until media is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  if (text === 'Deleted') {
    return (
      <div className="bubble deleted">
        <ExclamationCircleOutlined /> 삭제된 메시지입니다.
      </div>
    );
  }

  // Voice
  if (type === 'Voice') {
    if (!dateStr || ImageName === '') return <LoadingSpinner />;
    return (
      <div className="bubble voice audio">
        <audio
          src={require(`assets/fromm/${artistNum}/voice/${ImageName}_${text}.m4a`)}
          controls
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // Image
  if (type === 'Image') {
    if (!dateStr || ImageName === '') return <LoadingSpinner />;
    const image = require(`assets/fromm/${artistNum}/media/${ImageName}_${text}.PNG`);
    return (
      <div className="bubble image">
        {isLoading && <LoadingSpinner />}
        <img
          className={isLoading ? 'hidden' : ''}
          src={image}
          alt=""
          onLoad={onMediaLoad}
        />
      </div>
    );
  }

  // Video
  if (type === 'Video') {
    if (!dateStr || ImageName === '') return <LoadingSpinner />;
    const videoMedia = require(`assets/fromm/${artistNum}/video/${ImageName}_${text}.MP4`);
    return (
      <div className="bubble video">
        {isLoading && <LoadingSpinner />}
        <video
          className={isLoading ? 'hidden' : ''}
          controls
          onLoadedData={onMediaLoad}
        >
          <source src={videoMedia} type="video/MP4" />
        </video>
      </div>
    );
  }

  return <div className="bubble">{text && mentionedText(text)}</div>;
}

export default ChatBubble;
