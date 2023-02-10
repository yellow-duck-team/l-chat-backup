import react, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArtistListPage.css';

const artistName = [
    "희진 • HeeJin", "현진 • HyunJin", "하슬 • HaSeul", "여진 • YeoJin", 
    "비비 • ViVi", "김립 • Kim Lip", "진솔 • JinSoul", "최리 • Choerry", 
    "이브 • Yves", "츄 • Chuu", "고원 • Go Won", "올리비아 혜 • Olivia Hye"
];

let artists = [];
for (let i = 1; i < 13; i++) {
    try {
        // If artist exists
        let profileImg = require(`../../assets/${i}/profile/0.jpg`);
        artists.push({ 
            index: i,
            name: artistName[i - 1],
            profileImg: profileImg,
        });
    } catch (err) {
        // If artist doesn't exist, do nothing
        artists.push({
            index: i,
            name: artistName[i - 1],
            profileImg: "",
        });
    }
}

function ArtistListPage() {
    const navigate = useNavigate();

    const [Artist, setArtist] = useState("");
    const [SearchText, setSearchText] = useState("");

    useEffect(() => {
        for (let i = 0; i < 12; i++) {
            if (artists[i].profileImg !== "") {
                setArtist(`${artists[i].index}`);
                break;
            }
        }
    }, []);
    

    const onSelect = (event) => {
        setArtist(event.target.value);
    };

    // Search replies
    const onSearch = () => {
        // console.log(`/search?member=${Artist}&text=${SearchText}`);
        navigate(`/search?member=${Artist}&text=${SearchText}`);
    };

    return (
        <div className="mobile">
            <div className="artist-list">
                {artists && artists.length === 12 && artists.map((artistImg, index) => {
                    if (artistImg.profileImg !== "") {
                        return <img key={`artist-${index}`} src={artistImg.profileImg} className="artist-list-img" onClick={() => navigate(`/chat/${index + 1}`)} />;
                    }
                })}
            </div>
            <div className="artist-search">
                <h2>댓글 검색</h2>
                <select onChange={onSelect}>
                    {artists && artists.length === 12 && artists.map((artist, index) => {
                        if (artist.profileImg !== "") {
                            return <option key={`select-${index}`} value={index + 1}>{artist.name}</option>;
                        }
                    })}
                </select>
                <div className="search-text">
                    <input value={SearchText} onInput={(e) => setSearchText(e.target.value)} />
                    <button onClick={onSearch}>검색</button>
                </div>
            </div>
        </div>
    );
}

export default ArtistListPage;