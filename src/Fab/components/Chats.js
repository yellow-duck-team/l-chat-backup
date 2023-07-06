import React, { useEffect, useState } from 'react';
// Components
import ChatBubble from 'components/ChatBubble/ChatBubble';
import Date from './Date';
import Profile from './Profile';
// Style
import { NotificationOutlined } from '@ant-design/icons';
import './Chats.css';

function Chats({ artistNum, chatId, chatData }) {
  let chatDate = '';

  const [ChatData, setChatData] = useState([]);

  useEffect(() => {
    if (!chatId || !chatData) return;
    if (chatData && chatData[0]) {
      setChatData(chatData.slice(1));
    }
  }, [chatId, chatData]);

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

    return (
      <div key={`bubble-${index}`} className="block">
        {showChatDate()}
        <div className="block-top">
          {chat[2] === 'Notice' ? (
            <div className="notice">
              <NotificationOutlined />
            </div>
          ) : (
            <Profile artistNum={artistNum} />
          )}
          <div className="message">
            <ChatBubble
              service="fab"
              artistNum={artistNum}
              chatId={chatId}
              text={chat[0]}
              type={chat[2]}
              emoji={chat[0]}
              reply={chat[1]}
            />
          </div>
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
