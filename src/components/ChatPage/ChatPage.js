import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readString } from 'react-papaparse';
// Components
import Chats from './items/Chats';
// Style
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';

function ChatPage() {
    const navigate = useNavigate();

    const [ArtistNum, setArtistNum] = useState("");
    const [ChatId, setChatId] = useState("");
    const [CSVText, setCSVText] = useState([]);

    useEffect(() => {
        let chatId = window.location.pathname;
        chatId = chatId.split('/chat/')[1].split('/');
        setArtistNum(chatId[0]);
        setChatId(chatId[1]);
    }, []);

    useEffect(() => {
        if (ChatId !== "" && ArtistNum !== "") {
            const textCSV = require(`../../assets/${ArtistNum}/text.csv`);
            readString(textCSV, papaConfig);
        }
    }, [ArtistNum, ChatId]);

    const papaConfig = {
        complete: (results, file) => {
            // console.log('Parsing complete:', results, file);
            let dataCSV = results.data;
            // Get text data by message
            for (let i = 0; i < dataCSV[0].length; i += 4) {
                // Get text data by line
                if (ChatId === dataCSV[0][i]) {
                    let dataByLine = [];
                    for (let j = 2; j < dataCSV.length; j++) {
                        if (dataCSV[j].slice(i, i + 4)[2] === '') { // Empty line
                            break;
                        } else {
                            dataByLine.push(dataCSV[j].slice(i, i + 4));
                            // console.log(dataCSV[j].slice(i, i + 4));
                        }
                    }
                    // console.log(dataByMsg);
                    setCSVText(dataByLine);
                    break;
                }
            }
        },
        download: true,
        error: (error, file) => {
            console.log('Error while parsing:', error, file);
        },
    };

    return (
        <div className="mobile mobile-chat">
            <div className="header">
                <div className="top">
                    <div className="top-icon"><ArrowLeftOutlined onClick={() => navigate(`/chat/${ArtistNum}/${ChatId}`)} /></div>
                    <div className="text">
                        <p className="header-title">댓글</p>
                    </div>
                    <div className="top-icon"><MoreOutlined /></div>
                </div>
            </div>
            <div className="body">
                <Chats artistNum={ArtistNum} chatId={ChatId} chatData={CSVText} />
            </div>
        </div>
    );
}

export default ChatPage;