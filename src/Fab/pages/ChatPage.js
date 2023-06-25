import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Chats from 'Fab/components/Chats';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import EmptyList from 'components/EmptyList';
import MobileLayout from 'components/MobileLayout';
import { chatByMsgLine } from 'lib/group';
import { getFabPromise } from 'api/getData';
import { useFabDataContext } from 'context/fabDataState';
import '../components/Chats.css';

function ChatPage() {
  const { fabData, setFabData } = useFabDataContext();
  const location = useLocation();
  const artistNum = useMemo(
    () => location.pathname.split('/')[2],
    [location.pathname]
  );
  const chatId = useMemo(
    () => location.pathname.split('/')[3],
    [location.pathname]
  );

  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Missing artist number or chat ID
    if (!artistNum || artistNum === '' || chatId === '') return;
    // Already fetched data
    if (CSVText.length > 0) {
      setIsFetching(false);
      return;
    }
    // Fetch data
    setIsFetching(true);
    if (fabData && Object.keys(fabData).length === 2) {
      if (fabData[artistNum] && fabData[artistNum].length > 0) {
        // Get text data by message
        const { text } = chatByMsgLine(chatId, fabData[artistNum]);
        setCSVText(text);
      }
      setIsFetching(false);
    }
  }, [artistNum, chatId, CSVText.length, fabData]);

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!artistNum || artistNum === '' || chatId === '') return;
      if (!CSVText || CSVText.length === 0) {
        getFabPromise(artistNum).then((res) => {
          const fab = JSON.parse(JSON.stringify(res));
          if (fab && fab.length > 0) {
            setFabData(fab);
            // Get text data by message
            const { text } = chatByMsgLine(chatId, fab);
            setCSVText(text);
          }
        });
      }
      setIsFetching(false);
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  return (
    <MobileLayout
      className="mobile-chat fab"
      headerUrl={`/fab/${artistNum}/${chatId}`}
    >
      {isFetching ? (
        <LoadingSpinner />
      ) : CSVText && CSVText.length > 1 ? (
        <div className="body">
          <Chats artistNum={artistNum} chatId={chatId} chatData={CSVText} />
        </div>
      ) : (
        <EmptyList />
      )}
    </MobileLayout>
  );
}

export default ChatPage;
