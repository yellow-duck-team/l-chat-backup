import React, { useEffect, useState } from 'react';
import { parseDate } from 'lib/date';
import './ChatBubble.css';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useFrommDataContext } from 'context/frommDataState';
import { spaceId } from 'contentful/contentfulApi';
import { emojis, kaomojis, noSupport } from 'lib/constants';
import { StopOutlined } from '@ant-design/icons';

// Convert kaomojis to display properly
const displayKaomojis = (str, index) => {
  for (let i = index; i < kaomojis.length; i++) {
    const kaomoji = kaomojis[i];
    // Check if kaomoji is in str
    if (str.includes(kaomoji)) {
      let textList = str.split(kaomoji);
      // If kaomoji is in str
      if (textList.length > 1) {
        // Change font of the kaomoji
        return (
          <span>
            {displayKaomojis(textList[0], i + 1)}
            <span className="kaomoji-display">{kaomoji}</span>
            {displayKaomojis(textList.slice(1).join(kaomoji), i)}
          </span>
        );
      }
    }
  }
  return str;
};

// Convert emojis to display properly
const displayEmojis = (str, index) => {
  for (let i = index; i < emojis.length; i++) {
    const emoji = emojis[i];
    // Check if emoji is in str
    if (str.includes(emoji)) {
      let textList = str.split(emoji);
      // If emoji is in str
      if (textList.length > 1) {
        // Change font of the emoji
        return (
          <span>
            {displayEmojis(textList[0], i + 1)}
            <span className="emoji-display">{emoji}</span>
            {displayEmojis(textList.slice(1).join(emoji), i)}
          </span>
        );
      }
    }
  }
  return displayKaomojis(str, 0);
};

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
      <span className="mention select-none">크루 </span> {/* 오빛 */}
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
  if (text === '') return <span>{text}</span>;
  return text.split('\n').map((str, index) =>
    index < text.length - 1 ? (
      <span key={`chat-newline-${index}`}>
        {displayEmojis(str, 0)}
        <br />
      </span>
    ) : (
      <span key={`chat-newline-${index}`}>{displayEmojis(str, 0)}</span>
    )
  );
};

/**
 * Chat bubble component.
 * @param {string} dateStr chat date
 * @param {string} text chat text
 * @param {string} type type of the chat
 * @returns Chat bubble component
 */
function ChatBubble({
  service,
  artistNum,
  chatId = null,
  dateStr = null,
  text,
  type,
  emoji = null,
  reply = null,
  mediaurl = null,
  extension = null
}) {
  const { onOpenMedia } = useFrommDataContext();

  const [ImageName, setImageName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dateStr) return;
    if (service === 'vlive') {
      setImageName(dateStr.year.slice(2) + dateStr.month + dateStr.date);
    } else {
      const date = parseDate(dateStr);
      setImageName(date.year.slice(2) + date.month + date.date);
    }
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
    let audioMedia;
    if (service === 'fab') {
      if (text === '' || text === '-') {
        return (
          <div className="bubble voice">
            <StopOutlined />
            <p>음성 댓글</p>
          </div>
        );
      }
      audioMedia = require(`assets/fab/${artistNum}/voice/${chatId}_${text}.m4a`);
    } else if (!dateStr || ImageName === '') {
      return <LoadingSpinner />;
    } else if (service === 'vlive') {
      audioMedia = require(`assets/vlive/voice/${ImageName}_${text}.m4a`);
    } else if (mediaurl && mediaurl !== '' && extension && extension !== '') {
      audioMedia = `https://assets.ctfassets.net/${spaceId}/${mediaurl}/${ImageName}_${text}.${extension}`;
    } else {
      audioMedia = require(`assets/fromm/${artistNum}/voice/${ImageName}_${text}.m4a`);
    }
    return (
      <div
        className={
          service === 'vlive' ? 'chat-voice-blue' : 'bubble voice audio'
        }
      >
        <audio src={audioMedia} controls>
          {noSupport.audio}
        </audio>
      </div>
    );
  }

  // Image
  if (type === 'Image') {
    if (!dateStr || ImageName === '') return <LoadingSpinner />;
    let image;
    if (service === 'vlive') {
      image = require(`assets/vlive/media/${ImageName}_${text}.JPG`);
      return (
        <>
          {isLoading && <LoadingSpinner />}
          <img
            className={`${isLoading && 'hidden'} chat-img-blue`}
            src={image}
            alt=""
            onLoad={onMediaLoad}
            onClick={() => onOpenMedia(true, image, null, null)}
          />
        </>
      );
    }
    if (mediaurl && mediaurl !== '' && extension && extension !== '') {
      image = `https://images.ctfassets.net/${spaceId}/${mediaurl}/${ImageName}_${text}.${extension}`;
    } else {
      image = require(`assets/fromm/${artistNum}/media/${ImageName}_${text}.PNG`);
    }
    return (
      <div className="bubble image">
        {isLoading && <LoadingSpinner />}
        <img
          className={`${isLoading && 'hidden'}`}
          src={image}
          alt=""
          onLoad={onMediaLoad}
          onClick={() => onOpenMedia(true, image, null, null)}
        />
      </div>
    );
  }

  // Video
  if (type === 'Video') {
    if (!dateStr || ImageName === '') return <LoadingSpinner />;
    let videoMedia;
    if (mediaurl && mediaurl !== '' && extension && extension !== '') {
      videoMedia = `https://videos.ctfassets.net/${spaceId}/${mediaurl}/${ImageName}_${text}.${extension}`;
    } else {
      videoMedia = require(`assets/fromm/${artistNum}/video/${ImageName}_${text}.MP4`);
    }
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

  // Emoji
  if (type === 'Emoji' && emoji) {
    return <p className="bubble-emoji">{displayEmojis(emoji, 0)}</p>;
  }

  // Vlive Text
  if (service === 'vlive') {
    return (
      <div
        className={`${type.includes('Eng') ? 'chat-eng' : ''} chat-bubble-blue`}
      >
        <p className="artist-name">이달의 소녀(LOONA)</p>
        <p>{text}</p>
      </div>
    );
  }

  // Fab Text
  if (service === 'fab') {
    if (reply) {
      return (
        <div className="bubble">
          <div className="bubble-reply">{newLine(reply)}</div>
          {newLine(text)}
        </div>
      );
    }
    return <div className="bubble">{newLine(text)}</div>;
  }

  // Fromm Text
  if (service === 'fromm') {
    return <div className="bubble">{mentionedText(text)}</div>;
  }

  return <div className="bubble"></div>;
}

export default ChatBubble;
