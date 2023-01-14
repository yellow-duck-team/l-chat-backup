import react, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readString } from 'react-papaparse';
// Components
import Chat from '../ChatPage/items/Chat';
import { convertDate } from '../../App';
// Style
import './SearchPage.css';
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';

function SearchPage() {
    const navigate = useNavigate();

    const [ArtistNum, setArtistNum] = useState("");
    const [SearchText, setSearchText] = useState("");
    const [CSVText, setCSVText] = useState([]);

    useEffect(() => {
        let search = window.location.search.slice(1);
        search = search.split('&');
        setArtistNum(search[0].split('=')[1]);
        // decodeURI(x) vs decodeURIComponent(x)
        setSearchText(decodeURIComponent(search[1].split('=')[1]));
    }, []);

    useEffect(() => {
        if (ArtistNum !== "" && SearchText !== "") {
            const textCSV = require(`../../assets/${ArtistNum}/text.csv`);
            readString(textCSV, papaConfig);
        }
    }, [ArtistNum, SearchText]);

    const papaConfig = {
        complete: (results, file) => {
            // console.log('Parsing complete:', results, file);
            let dataCSV = results.data;
            // Get text data by search text
            let dataByText = [];
            for (let i = 0; i < dataCSV[0].length; i += 4) {
                for (let j = 2; j < dataCSV.length; j++) {
                    const slicedText = dataCSV[j].slice(i, i + 4);
                    if (slicedText[2] === '') { // Empty line
                        break;
                    }
                    if (slicedText[2] === "Text" || slicedText[2] === "Reply") {
                        if (slicedText[0].includes(SearchText)) {
                            dataByText.push({
                                chatId: dataCSV[0][i],
                                chatDate: slicedText[3],
                                chatText: slicedText,
                            });
                        }
                    }
                }
            }
            setCSVText(dataByText);
        },
        download: true,
        error: (error, file) => {
            console.log('Error while parsing:', error, file);
        },
    };

    const searchResults = CSVText.length > 0 ? CSVText.map((result, index) => {
        return (
            <div className="search-result">
                <h5>{convertDate(result.chatDate.split(" ")[0])} #{result.chatId}</h5>
                <div className="search-bubble" onClick={() => navigate(`/l-chat-backup/chat/${ArtistNum}/${result.chatId}/msg`)}>
                    <Chat artistNum={ArtistNum} chatId={result.chatId} chatData={result.chatText} noDate={true} />
                </div>
            </div>
        );
    }) 
    : "검색 결과가 없습니다.";

    return (
        <div className="mobile">
            <div className="header">
                <div className="top">
                    <div className="top-icon"><ArrowLeftOutlined onClick={() => navigate('/l-chat-backup')} /></div>
                    <div className="top-icon"><MoreOutlined /></div>
                </div>
            </div>
            <div className="search-results">
                <h2>댓글 검색</h2>
                <div className="search-block">
                    {searchResults}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;