import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readString } from 'react-papaparse';
// Import
import textCSV from '../../assets/12/text.csv';
// Components
import Chat from './items/Chat';
// Style
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';

function ChatPage() {
    const navigate = useNavigate();

    const [ChatId, setChatId] = useState("");
    const [CSVText, setCSVText] = useState([]);

    useEffect(() => {
        let chatId = window.location.pathname;
        chatId = chatId.slice(6, chatId.length).split('/');
        setChatId(chatId[0]);
    }, []);

    useEffect(() => {
        if (ChatId !== "") {
            // Load text data
            readString(textCSV, papaConfig);
        }
    }, [textCSV, ChatId]);

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
        <div className="mobile">
            <div className="header">
                <div className="top">
                    <div className="top-icon"><ArrowLeftOutlined onClick={() => navigate(`/chat/${ChatId}`)} /></div>
                    <div className="text">
                        <p className="header-title">이달의 소녀+</p>
                        <p className="header-subtitle">이달의 소녀(LOONA)</p>
                    </div>
                    <div className="top-icon"><MoreOutlined /></div>
                </div>
            </div>
            <div className="body">
                <Chat chatId={ChatId} chatData={CSVText} />
            </div>
        </div>
    );
}

export default ChatPage;