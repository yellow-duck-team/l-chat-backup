import React, { useEffect, useState } from 'react';
// Components
import ChatBubble from './ChatBubble';
import Date from './Date';
import Profile from './Profile';
// Style
import { NotificationOutlined } from '@ant-design/icons';
import './Chats.css';

function Chats(props) {
  let chatDate = '';

  const [ChatData, setChatData] = useState([]);

  useEffect(() => {
    if (props && props.chatId && props.chatData) {
      const chatData = props.chatData;
      if (chatData && chatData[0]) {
        setChatData(chatData.slice(1));
      }
    }
  }, [props]);

  const Bubbles = ChatData.map((chat, index) => {
    const showChatDate = () => {
      if (chatDate === '' || chatDate !== chat[3].split(' ')[0]) {
        chatDate = chat[3].split(' ')[0];
        return (
          <div className="top">
            <Date chatDate={chatDate} />
          </div>
        );
      }
    };

    const textBubble = () => {
      if (chat[2] === 'Reply' || chat[1] !== '') {
        return <ChatBubble index={index} chat={chat[0]} reply={chat[1]} />;
      }
      if (chat[2] === 'Emoji') {
        return <ChatBubble index={index} emoji={chat[0]} />;
      }
      if (chat[2] === 'Voice') {
        return (
          <ChatBubble
            index={index}
            voice={true}
            chat={chat[0]}
            artistNum={props.artistNum}
            chatId={props.chatId}
          />
        );
      }
      if (chat[2] === 'Notice') {
        return <ChatBubble index={index} notice={chat[0]} />;
      }
      return <ChatBubble index={index} chat={chat[0]} />;
    };

    return (
      <div key={`bubble-${index}`} className="block">
        {showChatDate()}
        <div className="block-top">
          {chat[2] === 'Notice' ? (
            <div className="notice">
              <NotificationOutlined />
            </div>
          ) : (
            <Profile artistNum={props.artistNum} />
          )}
          <div className="message">{textBubble()}</div>
        </div>
        <div className="right">
          <p className="time">{chat[3].split(' ')[1]}</p>
        </div>
      </div>
    );
  });

  return <div className="fab chat">{Bubbles}</div>;
}

export default Chats;
