import React, { useEffect, useState } from 'react';
// Components
import ChatBubble from 'components/ChatBubble/ChatBubble';
import Profile from './Profile';
// Style
import { NotificationOutlined } from '@ant-design/icons';
import './Chats.css';

function Chat(props) {
  // let chatDate = "";

  const [ChatData, setChatData] = useState([]);

  useEffect(() => {
    if (props && props.artistNum && props.chatId && props.chatData) {
      setChatData(props.chatData);
    }
  }, [props]);

  // const showChatDate = () => {
  //     if (chatDate === "" || (ChatData.length > 0 && chatDate !== ChatData[3].split(" ")[0])) {
  //         chatDate = ChatData[3].split(" ")[0];
  //         return <div className="top">
  //             <Date chatDate={chatDate} />
  //         </div>;
  //     }
  // };

  return (
    <div className="fab chat">
      {ChatData !== [] && ChatData.length > 0 && (
        <div className="block">
          <div className="block-top">
            {ChatData[2] === 'Notice' ? (
              <div className="notice">
                <NotificationOutlined />
              </div>
            ) : (
              <Profile artistNum={props.artistNum} />
            )}
            <div className="message">
              <ChatBubble
                service="fab"
                artistNum={props.artistNum}
                chatId={props.chatId}
                text={ChatData[0]}
                type={ChatData[2]}
                emoji={ChatData[0]}
                reply={ChatData[1]}
              />
            </div>
          </div>
          {!props.noDate && (
            <div className="right">
              <p className="time">{ChatData[3].split(' ')[1]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
