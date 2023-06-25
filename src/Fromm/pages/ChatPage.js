import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from 'Fromm/components/Profile';
import ChatBubble from 'Fromm/components/ChatBubble';
import Date from 'Fromm/components/Date';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import EmptyList from 'components/EmptyList';
import MobileLayout from 'components/MobileLayout';
import { formatTime } from 'lib/date';
import { groupByDate } from 'lib/group';
import { useFrommDataContext } from 'context/frommDataState';
import { getFrommPromise } from 'api/getData';
import './ChatPage.css';

export function Chat({ artistNum, chatData, chat, index, isChatList }) {
  const chatDate = () => {
    if (index !== 0) {
      const prevChat = chatData[index - 1];
      if (prevChat.Type === 'Default' || prevChat.Date !== chat.Date) {
        return <Date date={chat.Date} />;
      }
    } else if (chatData[index].Type !== 'Default') {
      return <Date date={chat.Date} index={index} />;
    }
  };

  return (
    <div className="chat">
      {isChatList && chatDate()}
      <div className="chat-piece flex-row">
        <Profile artistNum={artistNum} imgNum={chat.Profile} />
        <div className="chat-r">
          <p className="artist-name select-none">{chat.Name}</p>
          <div className="chat-r-b flex-row">
            <ChatBubble
              artistNum={artistNum}
              dateStr={chat.Date}
              text={chat.Text}
              type={chat.Type}
            />
            <p className="bubble-time flex-col select-none">
              {formatTime(chat.Time)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Chats({ artistNum, chatData, isChatList = true }) {
  const chatBubble = chatData.map((chat, index) => {
    if (
      chat.Date === '' ||
      chat.Text === '' ||
      chat.Type === '' ||
      chat.Name === '' ||
      chat.Profile === '' ||
      chat.Background === ''
    )
      return;

    return (
      <Chat
        key={`fromm-chat-${artistNum}-${index}`}
        artistNum={artistNum}
        chatData={chatData}
        chat={chat}
        index={index}
        isChatList={isChatList}
      />
    );
  });

  return (
    <div className="chat">{chatData && chatData.length > 0 && chatBubble}</div>
  );
}

/**
 * Chat page component.
 * @returns Chat page component
 */
function ChatPage() {
  const { frommData, setFrommData } = useFrommDataContext();
  const location = useLocation();

  const [ArtistNum, setArtistNum] = useState('');
  const [QueryDate, setQueryDate] = useState([]);
  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const artistNum = location.pathname.split('/')[2];
    setArtistNum(artistNum);
    if (location.search !== '' && location.search.includes('date=')) {
      const queryDate = location.search.split('date=')[1];
      const dateArr = queryDate.split('-');
      if (dateArr.length === 3) setQueryDate(dateArr);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    // Missing artist number
    if (ArtistNum === '') return;
    // Already fetched data
    if (CSVText.length > 0) {
      setIsFetching(false);
      return;
    }
    // Fetch data
    setIsFetching(true);
    if (frommData && Object.keys(frommData).length === 3) {
      if (frommData[ArtistNum] && frommData[ArtistNum].length > 0) {
        setCSVText(groupByDate(QueryDate, 'Date', frommData[ArtistNum]));
      }
      setIsFetching(false);
    }
  }, [ArtistNum, QueryDate, CSVText.length, frommData]);

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!ArtistNum || ArtistNum === '') return;
      if (!CSVText || CSVText === [] || CSVText.length === 0) {
        getFrommPromise(ArtistNum).then((res) => {
          const fromm = JSON.parse(JSON.stringify(res));
          if (fromm && fromm.length > 0) {
            setFrommData(fromm);
            setCSVText(groupByDate(QueryDate, 'Date', fromm));
          }
        });
      }
      setIsFetching(false);
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  const isLoading = isFetching;

  return (
    <MobileLayout className="fromm" headerUrl="/fromm">
      <div className="chatpage">
        {isLoading ? (
          <LoadingSpinner />
        ) : CSVText && CSVText.length > 0 ? (
          <Chats artistNum={ArtistNum} chatData={CSVText} />
        ) : (
          <EmptyList />
        )}
      </div>
    </MobileLayout>
  );
}

export default ChatPage;
