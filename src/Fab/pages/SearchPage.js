import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertDate } from 'App';
import Chat from 'Fab/components/Chat';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import MobileLayout from 'components/MobileLayout';
import { useFabDataContext } from 'context/fabDataState';
import { chatByMsgLine } from 'lib/group';
import { getFabPromise } from 'api/getData';
import './SearchPage.css';

function SearchPage() {
  const { fabData, setFabData } = useFabDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [ArtistNum, setArtistNum] = useState('');
  const [SearchText, setSearchText] = useState('');
  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let search = location.search.slice(1);
    if (search === '') {
      setSearchText('');
    } else {
      search = search.split('&');
      setArtistNum(search[0].split('=')[1]);
      // decodeURI(x) vs decodeURIComponent(x)
      setSearchText(decodeURIComponent(search[1].split('=')[1]));
    }
  }, [location.search]);

  useEffect(() => {
    // Missing artist number
    if (!ArtistNum || ArtistNum === '') return;
    // Empty string
    if (SearchText === '') {
      setCSVText([]);
      setIsFetching(false);
      return;
    }
    // Already fetched data
    if (CSVText.length > 0) {
      setIsFetching(false);
      return;
    }
    // Fetch data
    setIsFetching(true);
    if (fabData && Object.keys(fabData).length === 2) {
      if (fabData[ArtistNum] && fabData[ArtistNum].length > 0) {
        // Get text data by message
        const { text } = chatByMsgLine(null, fabData[ArtistNum], SearchText);
        setCSVText(text);
      }
      setIsFetching(false);
    }
  }, [ArtistNum, SearchText, CSVText.length, fabData]);

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!ArtistNum || ArtistNum === '') return;
      if (SearchText === '' || CSVText.length === 0) {
        getFabPromise(ArtistNum).then((res) => {
          const fab = JSON.parse(JSON.stringify(res));
          if (fab && fab.length > 0) {
            setFabData(fab);
            // Get text data by message
            const { text } = chatByMsgLine(null, fab, SearchText);
            setCSVText(text);
          }
        });
      }
      setIsFetching(false);
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  const searchResults =
    CSVText.length > 0
      ? CSVText.map((result, index) => (
          <div key={`fab-search-${index}`} className="search-result">
            <h5>
              {convertDate(result.chatDate.split(' ')[0])} #{result.chatId}
            </h5>
            <div
              className="search-bubble"
              onClick={() => navigate(`/fab/${ArtistNum}/${result.chatId}/msg`)}
            >
              <Chat
                artistNum={ArtistNum}
                chatId={result.chatId}
                chatData={result.chatText}
                noDate={true}
              />
            </div>
          </div>
        ))
      : '검색 결과가 없습니다.';

  const isLoading = isFetching;

  return (
    <MobileLayout className="fab" headerUrl="/fab">
      <div className="search-results">
        <h2>"{SearchText}" 검색 결과</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="search-block">{searchResults}</div>
        )}
      </div>
    </MobileLayout>
  );
}

export default SearchPage;
