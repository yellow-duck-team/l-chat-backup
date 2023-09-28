import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { searchText } from 'lib/group';
import { useFrommDataContext } from 'context/frommDataState';
import { Chat } from 'Fromm/pages/ChatPage';
import './SearchPage.css';

/**
 * Search bar component
 * @param {Object} artistNum: artist number
 * @returns Search bar component
 */
function SearchBar({ artistNum }) {
  const { profile } = useFrommDataContext();
  const navigate = useNavigate();

  const [SearchText, setSearchText] = useState('');

  if (!artistNum) return <div></div>;

  const onSearch = () => {
    if (typeof SearchText === 'string' && SearchText.length > 0)
      navigate(`/fromm/${artistNum}/search?text=${SearchText}`);
    else navigate(`/fromm/${artistNum}/search`);
  };

  return (
    <div className="fromm-artist fromm-search-bar flex-row">
      {profile && profile[artistNum] && (
        <img src={profile[artistNum].profile.slice(-1)} alt="" />
      )}
      <div className="fromm-search flex-row">
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
 * Artitst list page component
 * @returns Artist list page component
 */
function SearchPage() {
  const { frommData, profile } = useFrommDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [ArtistList, setArtistList] = useState([]);
  const [ArtistNum, setArtistNum] = useState(null);
  const [SearchText, setSearchText] = useState('');
  const [FetchedData, setFetchedData] = useState([]);
  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      const artists = [];
      for (let [key, value] of Object.entries(profile)) {
        artists.push(key);
      }
      setArtistList(artists);
    }
  }, [profile]);

  useEffect(() => {
    if (!location.pathname) return;
    const artistNum = location.pathname.split('/')[2];
    for (let i = 0; i < ArtistList.length; i++) {
      if (ArtistList[i] === artistNum) {
        setArtistNum(ArtistList[i]);
      }
    }
    if (location.search !== '' && location.search.includes('text=')) {
      const searchText = location.search.split('text=')[1];
      setSearchText(decodeURIComponent(searchText));
    }
  }, [location.pathname, location.search, ArtistList]);

  useEffect(() => {
    // Missing artist number
    if (!ArtistNum || ArtistNum === '') return;
    setIsFetching(true);
    // Empty string
    if (SearchText === '') {
      setCSVText([]);
      setIsFetching(false);
      return;
    }
    // Already fetched data once
    if (FetchedData.length > 0) {
      setCSVText(searchText(FetchedData, SearchText));
      setIsFetching(false);
      return;
    }
    if (!frommData) return;
    // Fetch data
    const data = frommData[ArtistNum];
    if (frommData && (data || Object.keys(frommData).length === 3)) {
      if (data && data.length > 0) {
        setFetchedData(data);
        setCSVText(searchText(data, SearchText));
      }
      setIsFetching(false);
    }
  }, [ArtistNum, SearchText, frommData, CSVText.length]);

  const onResult = (date) => {
    navigate(`/fromm/${ArtistNum}?date=${date.split('.').join('-')}`);
  };

  const searchResults =
    CSVText &&
    CSVText.length > 0 &&
    CSVText.map((chat, index) => (
      <div
        key={`fromm-search-chat-${index}`}
        className="search-result-chat"
        onClick={() => onResult(chat.date)}
      >
        <h4>{chat.date}</h4>
        <Chat
          artistNum={ArtistNum}
          chatData={[]}
          chat={chat}
          index={index}
          isChatList={false}
        />
      </div>
    ));

  const isLoading = isFetching;

  return (
    <MobileLayout className="mobile-header fromm" headerUrl="/fromm">
      <div className="fromm-artist-list search-list flex-col">
        {ArtistNum && ArtistNum !== null && <SearchBar artistNum={ArtistNum} />}
        <div className="search-results">
          <h2>"{SearchText}" 검색 결과</h2>
          {isLoading ? <LoadingSpinner /> : searchResults}
        </div>
      </div>
    </MobileLayout>
  );
}

export default SearchPage;
