import react, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readString } from 'react-papaparse';
// Import
import textCSV from '../../assets/12/text.csv';
import profileImg from '../../assets/12/profile/0.jpg';
import backgroundImg from '../../assets/12/bg/0.jpg';
// Style
import { ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';
import './ArtistPage.css';

function ArtistPage() {
    const navigate = useNavigate();

    const [CSVText, setCSVText] = useState([]);

    useEffect(() => {
        readString(textCSV, papaConfig);
    }, [textCSV]);
    
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
                    data: dataCSV[2].slice(i, i + 4) 
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
        navigate(`/chat/${msgNum}`);
    };

    const msgImg = CSVText !== [] ? CSVText.map((data, index) => {
        if (data.data[0] === "(Video)") {
            return (
                <div key={index} className="artist-msg" onClick={() => onClickThumbnail(data.msgNum)}>
                    <video width="750" height="500" >
                        <source src={require(`../../assets/12/media/${data.msgNum}_0.mp4`)} type="video/mp4"/>
                    </video>
                </div>
            );
        }
        return (
            <div key={index} className="artist-msg" onClick={() => onClickThumbnail(data.msgNum)}>
                <img src={require(`../../assets/12/media/${data.msgNum}_0.jpg`)} />
            </div>
        );
    }) : "";

    return (
        <div className="artistpage">
            <div className="top">
                <div className="top-icon" onClick={() => navigate('/')}><ArrowLeftOutlined /></div>
                <div className="top-icon"><MoreOutlined /></div>
            </div>
            <img src={profileImg} className="artist-profile" />
            <img src={backgroundImg} className="artist-background" />
            <div className="profile-name">
                <p>올리비아 혜 • Olivia Hye</p>
            </div>
            <div className="body">
                {msgImg}
            </div>
        </div>
    );
}

export default ArtistPage;