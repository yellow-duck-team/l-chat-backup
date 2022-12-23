import react from 'react';
import { useNavigate } from 'react-router-dom';
import profileImg from '../../assets/12/profile/0.jpg';
import './ArtistListPage.css';

function ArtistListPage() {
    const navigate = useNavigate();

    return (
        <div className="mobile">
            <img src={profileImg} className="artist-list-img" onClick={() => navigate('/l-chat-backup/chat')} />
        </div>
    );
}

export default ArtistListPage;