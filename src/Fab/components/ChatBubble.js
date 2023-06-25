import React, { useCallback, useEffect, useState } from 'react';
// Style
import { StopOutlined } from '@ant-design/icons';
import './ChatBubble.css';

function ChatBubble(props) {
  const [Text, setText] = useState('');

  // Convert kaomojis to display properly
  const displayKaomojis = useCallback((str, index) => {
    const kaomojis = ['ᕙ( ︡’︡益’︠)ง'];
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
  }, []);

  // Convert emojis to display properly
  const displayEmojis = useCallback(
    (str, index) => {
      const emojis = ['♥️', '☺️', '☺'];
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
    },
    [displayKaomojis]
  );

  useEffect(() => {
    if (props && props.chat) {
      const chat = props.chat.split('\n').map((str, index) =>
        str === '' ? (
          <p key={`bubble-chat-${props.index}-${index}`}>
            <br />
          </p>
        ) : (
          <p key={`bubble-chat-${props.index}-${index}`}>
            {displayEmojis(str, 0)}
          </p>
        )
      );
      setText(chat);
    }
  }, [props, displayEmojis]);

  // Reply
  if (props.reply) {
    const reply = props.reply.split('\n').map((str, index) =>
      str === '' ? (
        <p key={`bubble-reply-${props.index}-${index}`}>
          <br />
        </p>
      ) : (
        <p key={`bubble-reply-${props.index}-${index}`}>
          {displayEmojis(str, 0)}
        </p>
      )
    );
    return (
      <div className="bubble">
        <div className="bubble-reply">{reply}</div>
        {Text}
      </div>
    );
  }

  // Emoji
  if (props.emoji) {
    const emoji = props.emoji;
    return (
      <p key={`bubble-emoji-${props.index}`} className="bubble-emoji">
        {displayEmojis(emoji, 0)}
      </p>
    );
  }

  // Voice
  if (props.voice) {
    if (props.chat === '' || props.chat === '-') {
      return (
        <div className="bubble voice">
          <StopOutlined />
          <p>음성 댓글</p>
        </div>
      );
    }
    return (
      <div className="bubble voice audio">
        <audio
          src={require(`assets/fab/${props.artistNum}/voice/${props.chatId}_${props.chat}.m4a`)}
          controls
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // Notice
  if (props.notice) {
    return (
      <div className="bubble notice">
        <p key={`bubble-notice-${props.index}`}>{props.notice}</p>
      </div>
    );
  }

  return <div className="bubble">{Text}</div>;
}

export default ChatBubble;
