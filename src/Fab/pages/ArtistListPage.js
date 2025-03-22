import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from 'components/MobileLayout';
import './ArtistListPage.css';

const artistName = [
  '희진 • HeeJin',
  '현진 • HyunJin',
  '하슬 • HaSeul',
  '여진 • YeoJin',
  '비비 • ViVi',
  '김립 • Kim Lip',
  '진솔 • JinSoul',
  '최리 • Choerry',
  '이브 • Yves',
  '츄 • Chuu',
  '고원 • Go Won',
  '올리비아 혜 • Olivia Hye'
];
const artists = [];
for (let i = 1; i < 13; i++) {
  try {
    // If artist exists
    let profileImg = require(`assets/fab/${i}/profile/0.jpg`);
    artists.push({
      index: i,
      name: artistName[i - 1],
      profileImg: profileImg
    });
  } catch (err) {} // If artist doesn't exist, do nothing
}

/**
 * Search component.
 * @returns Search component
 */
function Search() {
  const navigate = useNavigate();

  const [Artist, setArtist] = useState('');
  const [SearchText, setSearchText] = useState('');

  // Set first artist to the Search Bar
  useEffect(() => {
    if (artists.length > 0 && artists[0].profileImg !== '') {
      setArtist(`${artists[0].index}`);
    }
  }, []);

  // Select artist to search replies
  const onSelect = (event) => {
    setArtist(event.target.value);
  };

  // Search fab replies
  const onSearch = () => {
    navigate(`/fab/search?member=${Artist}&text=${SearchText}`);
  };

  return (
    <div className="artist-search">
      <h2>댓글 검색</h2>
      <select onChange={onSelect}>
        {artists &&
          artists.length > 0 &&
          artists.map((artist, index) => (
            <option key={`select-${index}`} value={artist.index}>
              {artist.name}
            </option>
          ))}
      </select>
      <div className="search-text">
        <input
          value={SearchText}
          onInput={(e) => setSearchText(e.target.value)}
        />
        <button onClick={onSearch}>검색</button>
      </div>
    </div>
  );
}

/**
 * Artist list page component.
 * @returns Artist list page component
 */
function ArtistListPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout className="fab" headerUrl="/">
      <div className="mobile-inner fab-artists-page flex-col flex-center">
        <div className="artist-list flex-col flex-center">
          {artists &&
            artists.length > 0 &&
            artists.map((artist, index) => (
              <img
                key={`artist-list-${index}`}
                src={artist.profileImg}
                className="artist-list-img"
                onClick={() => navigate(`/fab/${artist.index}`)}
                alt=""
              />
            ))}
        </div>
        <Search />
      </div>
    </MobileLayout>
  );
}

export default ArtistListPage;
