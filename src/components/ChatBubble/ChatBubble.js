import React, { useEffect, useState } from 'react';
import './ChatBubble.css';

function ChatBubble(props) {
    const [Text, setText] = useState("");
    const [Photo, setPhoto] = useState("");

    useEffect(() => {
        if (props) {
            if (props.chat) {
                const chat = props.chat.split('\n').map(str => <p>{str}</p>);
                setText(chat);
            }
            // if (props.chat) setText(props.chat);
            else if (props.photo) setPhoto(props.photo);
        }
    }, [props]);

    if (props.reply) {
        return (
            <div className="bubble">
                <div className="bubble-reply"><p>{props.reply}</p></div>
                {Text}
                {/* {Text !== "" ? Text : (Photo && Photo !== "" ? <img src={Photo} /> : "")} */}
            </div>
        );
    } 
    return (
        <div className="bubble">
            {Text}
            {/* {Text !== "" ? Text : (Photo && Photo !== "" ? <img src={Photo} /> : "")} */}
        </div>
    );
}

export default ChatBubble;