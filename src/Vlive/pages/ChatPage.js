import React, { useEffect, useMemo, useState } from 'react';
import EmptyList from 'components/EmptyList';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ChatBubble from 'components/ChatBubble/ChatBubble';
import { useLocation } from 'react-router';
import { parseDate } from 'lib/date';
import { chatObjByDate } from 'lib/group';
import { getVlivePromise } from 'api/getData';
import { useVliveDataContext } from 'context/vliveDataState';
import './ChatPage.css';

/**
 * Chat page component
 * @returns Chat page component
 */
function ChatPage() {
  const { vliveData, setVliveData } = useVliveDataContext();
  const location = useLocation();
  const dateStr = useMemo(
    () => location.pathname.split('/').pop(),
    [location.pathname]
  );
  const date = useMemo(() => parseDate(dateStr), [dateStr]);

  const [ChatList, setChatList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Already fetched data
    if (ChatList.length > 0) {
      setIsFetching(false);
      return;
    }
    // Fetch data
    setIsFetching(true);
    if (vliveData && vliveData.length > 0) {
      setChatList(chatObjByDate(vliveData, date, dateStr));
      setIsFetching(false);
    }
  }, [ChatList.length, vliveData, date, dateStr]);

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!ChatList || ChatList.length === 0) {
        getVlivePromise().then((res) => {
          const vlive = JSON.parse(JSON.stringify(res));
          if (vlive && vlive.length > 0) {
            setVliveData(vlive);
            setChatList(chatObjByDate(vlive, date, dateStr));
          }
        });
      }
      setIsFetching(false);
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  const isLoading = isFetching || date === {};

  return (
    <MobileLayout className="vlive vlive-chat-page" headerUrl="/vlive">
      <div className="flex-col chats">
        {isLoading ? (
          <LoadingSpinner />
        ) : ChatList && ChatList.length > 0 ? (
          ChatList.map((chat, index) => (
            <ChatBubble
              key={`vlive-chat-bubble-${dateStr}-${index}`}
              service="vlive"
              dateStr={chat.date}
              text={chat.text}
              type={chat.type}
            />
          ))
        ) : (
          <EmptyList />
        )}
      </div>
    </MobileLayout>
  );
}

export default ChatPage;
