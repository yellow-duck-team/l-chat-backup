import react, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readString } from 'react-papaparse';
// Style
import { ArrowLeftOutlined, CommentOutlined, MoreOutlined } from '@ant-design/icons';
import './MessagePage.css';

const artistName = [
    "희진 • HeeJin", "현진 • HyunJin", "하슬 • HaSeul", "여진 • YeoJin", 
    "비비 • ViVi", "김립 • Kim Lip", "진솔 • JinSoul", "최리 • Choerry", 
    "이브 • Yves", "츄 • Chuu", "고원 • Go Won", "올리비아 혜 • Olivia Hye"
];

function MessagePage() {
    const navigate = useNavigate();

    const [ArtistNum, setArtistNum] = useState("");
    const [ProfileImg, setProfileImg] = useState("");
    const [ChatId, setChatId] = useState("");
    const [CSVText, setCSVText] = useState([]);

    useEffect(() => {
        let chatId = window.location.pathname;
        chatId = chatId.split('/chat/')[1].split('/');
        setArtistNum(chatId[0]);
        setChatId(chatId[1]);
        const profileImg = require(`../../assets/${chatId[0]}/profile/0.jpg`);
        setProfileImg(profileImg);
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
                    setCSVText(dataByLine[0]);
                    break;
                }
            }
        },
        download: true,
        error: (error, file) => {
            console.log('Error while parsing:', error, file);
        },
    };

    // Stylize message
    const message = () => {
        if (ChatId === "" || !CSVText || CSVText === [] || CSVText.length === 0) {
            return <p></p>;
        }
        // Video
        if (CSVText[0] === "(Video)") {
            return (
                <div className="artist-msg video">
                    <video width="750" height="500" controls autoPlay >
                        <source src={require(`../../assets/${ArtistNum}/media/${ChatId.length === 1 ? "0" + ChatId : ChatId}_0.mp4`)} type="video/mp4"/>
                    </video>
                </div>
            );
        }
        // Full Image
        if (CSVText[0] === "(Full Image)") {
            return (
                <div className="artist-msg full-img">
                    <img src={require(`../../assets/${ArtistNum}/media/${ChatId.length === 1 ? "0" + ChatId : ChatId}_0.jpg`)} />
                </div>
            ); 
        }
        // If text or image text
        console.log(CSVText[0]);
        const msgText = CSVText[0].split('\n');
        let imgCount = 0;
        for (let i = 0; i < msgText.length; i++) {
            // Image Grid
            if (msgText[i].includes("(Image)")) {
                const lineImgCount = msgText[i].split('(Image)').length - 1
                const num = imgCount + lineImgCount;
                let msgImg = [];
                let j = imgCount;
                while (j < num) {
                    msgImg.push(<img key={`img-${i}`} src={require(`../../assets/${ArtistNum}/media/${ChatId.length === 1 ? "0" + ChatId : ChatId}_${j}.jpg`)} />)
                    j++;
                }
                msgText[i] = <div key={`text-${i}`} className={`artist-msg msg-img-${lineImgCount}`}>{msgImg}</div>;
                imgCount = j;
            } else {
                if (msgText[i] === "") {
                    msgText[i] = <p> </p>;
                } else {
                    // Color and Size
                    msgText[i] = styleText(msgText[i]);
                    msgText[i] = <p key={i}>{msgText[i]}</p>;
                }
            }
        }
        return (
            <div className="msg-text">
                {msgText}
            </div>
        );
    };

    // Get index of first style
    const minStyleIndex = (text, styleType) => {
        let styleIndex = -1;
        let firstStyle = "";
        for (let col = 0; col < styleType.length; col++) {
            const index = text.indexOf(`(${styleType[col]})`);
            if (index >= 0 && (index < styleIndex || styleIndex < 0)) {
                styleIndex = index;
                firstStyle = styleType[col];
            }
        }
        return firstStyle;
    };

    // Color text
    const styleText = (text) => {
        // Get index of first style
        const firstStyle = minStyleIndex(text, ["small", "big", "blue", "green", "red", "pink"]);
        // If text is stylized
        if (firstStyle !== "") {
            let colList = text.split(`(${firstStyle})`);
            const colText = colList[1].split(`(/${firstStyle})`);
            if (colList.length > 2) {
                return <span>
                    {colList[0]}
                    <span className={`msg-text-${firstStyle}`}>{
                        firstStyle === "big" ? styleText(colText[0]) : colText[0]
                    }</span>
                    {styleText(colText[1] + colList.slice(2).join(`(${firstStyle})`))};
                </span>;
            } else {
                return <span>
                    {colList[0]}
                    <span className={`msg-text-${firstStyle}`}>{
                        firstStyle === "big" ? styleText(colText[0]) : colText[0]
                    }</span>
                    {styleText(colText[1])}
                </span>;
            }
        }
        return text;
    };

    // Go back to artist page
    const onArtistPage = () => {
        navigate(`/l-chat-backup/chat/${ArtistNum}/`);
    };

    const onChatPage = () => {
        navigate(`/l-chat-backup/chat/${ArtistNum}/${ChatId}/msg`);
    };

    return (
        <div className="msgpage">
            <div className="top">
                <div className="top-icon" onClick={onArtistPage}><ArrowLeftOutlined /></div>
                <div className="top-icon"><MoreOutlined /></div>
            </div>
            <div className="msg-body">
                {ChatId !== "" && CSVText && CSVText.length > 0 && message()}
            </div>
            <div className="msg-footer">
                <div className="footer-left">
                    <img src={ProfileImg} className="artist-profile" />
                    <div className="footer-text">
                        <p className="profile-name">{artistName[ArtistNum - 1]}</p>
                        {CSVText && CSVText.length > 0 && <p>{CSVText[3]}</p>}
                    </div>
                </div>
                <div className="footer-right">
                    <div className="footer-icon" onClick={onChatPage}><CommentOutlined /></div>
                    <p>댓글</p>
                </div>
            </div>
        </div>
    );
}

export default MessagePage;