import React, { useEffect, useState } from 'react';
// Components
import ChatBubble from '../../ChatBubble/ChatBubble';
import Date from '../../Date/Date';
import Profile from '../../Profile/Profile';
// Style
import { NotificationOutlined } from '@ant-design/icons';
import './Chats.css';

function Chat(props) {
    let chatDate = "";

    const [ChatData, setChatData] = useState([]);

    useEffect(() => {
        if (props && props.artistNum && props.chatId && props.chatData) {
            setChatData(props.chatData);
            console.log(props);
        }
    }, [props]);

    const showChatDate = () => {
        if (chatDate === "" || (ChatData.length > 0 && chatDate !== ChatData[3].split(" ")[0])) {
            chatDate = ChatData[3].split(" ")[0];
            return <div className="top">
                <Date chatDate={chatDate} />
            </div>;
        }
    };

    const textBubble = (index) => {
        if (ChatData[2] === "Reply" || ChatData[1] !== "") {
            return <ChatBubble index={index} chat={ChatData[0]} reply={ChatData[1]} />;
        }
        if (ChatData[2] === "Emoji") {
            return <ChatBubble index={index} emoji={ChatData[0]} />;
        }
        if (ChatData[2] === "Voice") {
            return <ChatBubble index={index} voice={true} chat={"음성 댓글"} />;
        }
        if (ChatData[2] === "Notice") {
            return <ChatBubble index={index} notice={ChatData[0]} />;
        }
        return <ChatBubble index={index} chat={ChatData[0]} />;
    }

    return (
        <div className="chat">
            {ChatData !== [] && ChatData.length > 0 &&
                <div className="block">
                    <div className="block-top">
                        {ChatData[2] === "Notice" ? <div className="notice"><NotificationOutlined /></div> : <Profile artistNum={props.artistNum} />}
                        <div className="message">
                            {textBubble()}
                        </div>
                    </div>
                    {!props.noDate && <div className="right">
                        <p className="time">{ChatData[3].split(" ")[1]}</p>
                    </div>}
                </div>
            }
        </div>
    );
}

export default Chat;