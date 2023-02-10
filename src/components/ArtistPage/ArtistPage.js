import react, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readString } from 'react-papaparse';
// Components
import { convertDate } from '../../App';
// Style
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';
import './ArtistPage.css';

const artistName = [
    "희진 • HeeJin", "현진 • HyunJin", "하슬 • HaSeul", "여진 • YeoJin", 
    "비비 • ViVi", "김립 • Kim Lip", "진솔 • JinSoul", "최리 • Choerry", 
    "이브 • Yves", "츄 • Chuu", "고원 • Go Won", "올리비아 혜 • Olivia Hye"
];

function ArtistPage() {
    const navigate = useNavigate();

    const [ArtistNum, setArtistNum] = useState("");
    const [ProfileImg, setProfileImg] = useState("");
    const [BGImg, setBGImg] = useState("");
    const [CSVText, setCSVText] = useState([]);

    useEffect(() => {
        let chatId = window.location.pathname;
        chatId = chatId.split('/chat/')[1].split('/');
        setArtistNum(chatId[0]);
        const profileImg = require(`../../assets/${chatId[0]}/profile/0.jpg`);
        setProfileImg(profileImg);
        const bgImg = require(`../../assets/${chatId[0]}/bg/0.jpg`);
        setBGImg(bgImg);
    }, []);

    useEffect(() => {
        if (ArtistNum !== "") {
            const textCSV = require(`../../assets/${ArtistNum}/text.csv`);
            readString(textCSV, papaConfig);
        }
    }, [ArtistNum]);
    
    const papaConfig = {
        complete: (results, file) => {
            let dataCSV = results.data;
            // Get text data by message
            let dataByMsg = [];
            let i = 0;
            while (i < dataCSV[0].length) {
                if (dataCSV[0][i] === "") break;
                // Get text data by line
                dataByMsg.push({ 
                    msgNum: dataCSV[0][i], 
                    data: dataCSV[2].slice(i, i + 4),
                });
                i += 4;
            }
            // console.log(dataByMsg);
            setCSVText(dataByMsg);
        },
        download: true,
        error: (error, file) => {
            console.log('Error while parsing:', error, file);
        },
    };

    const onClickThumbnail = (msgNum) => {
        navigate(`/chat/${ArtistNum}/${msgNum}`);
    };

    const msgImg = CSVText !== [] ? CSVText.map((data, index) => {
        // Message with a video
        if (data.data[0] === "(Video)") {
            return (
                <div key={`img-${index}`} className="artist-msg" onClick={() => onClickThumbnail(data.msgNum)}>
                    <p>{convertDate(data.data[3].slice(0, 10))}</p>
                    <video width="750" height="500" >
                        <source src={require(`../../assets/${ArtistNum}/media/${data.msgNum.length === 1 ? "0" + data.msgNum : data.msgNum}_0.mp4`)} type="video/mp4"/>
                    </video>
                </div>
            );
        }
        // Message without media
        if (!data.data[0].includes("Image")) {
            return (
                <div key={`img-${index}`} className="artist-msg" onClick={() => onClickThumbnail(data.msgNum)}>
                    <p>{convertDate(data.data[3].slice(0, 10))}</p>
                    <img src={require(`../../assets/empty.jpg`)} />
                </div>
            );
        }
        // Message with an image
        return (
            <div key={`img-${index}`} className="artist-msg" onClick={() => onClickThumbnail(data.msgNum)}>
                <p>{convertDate(data.data[3].slice(0, 10))}</p>
                <img src={require(`../../assets/${ArtistNum}/media/${data.msgNum.length === 1 ? "0" + data.msgNum : data.msgNum}_0.jpg`)} />
            </div>
        );
    }) : "";

    return (
        <div className="artistpage">
            <div className="top">
                <div className="top-icon" onClick={() => navigate('/')}><ArrowLeftOutlined /></div>
                <div className="top-icon"><MoreOutlined /></div>
            </div>
            <img src={ProfileImg} className="artist-profile" />
            <img src={BGImg} className="artist-background" />
            <div className="profile-name">
                <p>{artistName[ArtistNum - 1]}</p>
            </div>
            <div className="body">
                {msgImg}
            </div>
        </div>
    );
}

export default ArtistPage;