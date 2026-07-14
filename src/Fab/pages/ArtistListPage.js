import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from 'components/MobileLayout';
import ImageMedia from 'components/ImageMedia';
import { useFabDataContext } from 'context/fabDataState';
import { artistName } from 'lib/fabMedia';
import './ArtistListPage.css';

// Artist numbers that have fab data, in order
const artistNums = (fabData) =>
  Object.keys(fabData || {}).sort((a, b) => Number(a) - Number(b));

/**
 * Search component.
 * @returns Search component
 */
function Search() {
  const { fabData } = useFabDataContext();
  const navigate = useNavigate();

  const [Artist, setArtist] = useState('');
  const [SearchText, setSearchText] = useState('');

  const nums = artistNums(fabData);

  // Set first artist to the Search Bar
  useEffect(() => {
    if (nums.length > 0 && Artist === '') {
      setArtist(nums[0]);
    }
  }, [fabData, Artist]);

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
        {nums.map((num) => (
          <option key={`select-${num}`} value={num}>
            {artistName[Number(num) - 1]}
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
  const { fabData, fabProfile } = useFabDataContext();
  const navigate = useNavigate();

  const nums = artistNums(fabData);

  return (
    <MobileLayout className="fab" headerUrl="/">
      <div className="mobile-inner fab-artists-page flex-col flex-center">
        <div className="artist-list flex-col flex-center">
          {nums.map((num) => (
            <ImageMedia
              key={`artist-list-${num}`}
              sources={fabProfile[num]?.profile || []}
              className="artist-list-img"
              onClick={() => navigate(`/fab/${num}`)}
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
