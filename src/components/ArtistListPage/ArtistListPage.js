import react from 'react';
import { useNavigate } from 'react-router-dom';
import './ArtistListPage.css';

let artists = [];

for (let i = 1; i < 13; i++) {
    try {
        // If artist exists
        let profileImg = require(`../../assets/${i}/profile/0.jpg`);
        artists.push(profileImg);
    } catch (err) {
        // If artist doesn't exist, do nothing
        artists.push("");
    }
}

function ArtistListPage() {
    const navigate = useNavigate();

    return (
        <div className="mobile artist-list">
            {artists.map((artistImg, index) => {
                if (artistImg !== "") {
                    return <img key={index} src={artistImg} className="artist-list-img" onClick={() => navigate(`/l-chat-backup/chat/${index + 1}`)} />;
                }
            })}
        </div>
    );
}

export default ArtistListPage;