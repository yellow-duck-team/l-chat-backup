import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Chats from 'Fab/components/Chats';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import EmptyList from 'components/EmptyList';
import MobileLayout from 'components/MobileLayout';
import { chatByMsgLine } from 'lib/group';
import { useFabDataContext } from 'context/fabDataState';
import './ChatPage.css';

function ChatPage() {
  const { fabData } = useFabDataContext();
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

  return (
    <MobileLayout
      className="mobile-chat fab"
      headerUrl={`/fab/${artistNum}/${chatId}`}
    >
      {isFetching ? (
        <LoadingSpinner />
      ) : CSVText && CSVText.length > 1 ? (
        <div className="chat-page">
          <Chats artistNum={artistNum} chatId={chatId} chatData={CSVText} />
        </div>
      ) : (
        <EmptyList />
      )}
    </MobileLayout>
  );
}

export default ChatPage;
