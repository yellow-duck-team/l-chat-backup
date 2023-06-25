import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from 'components/MobileLayout';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { getVlivePromise } from 'api/getData';
import { useVliveDataContext } from 'context/vliveDataState';
import './ChatListPage.css';

/**
 * Chat preview component.
 * @param {string} date: date of the chat
 * @returns Chat preview component
 */
function ChatPreview({ date }) {
  const navigate = useNavigate();

  const onPreview = () => {
    navigate(`/vlive/${date}`);
  };

  return (
    <div className="chat-preview" onClick={onPreview}>
      <h3>{date}</h3>
    </div>
  );
}

/**
 * Chat list page component.
 * @returns Chat list page component
 */
function ChatListPage() {
  const { vliveData, setVliveData } = useVliveDataContext();

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
      let chatList = [];
      for (let i = 1; i < vliveData.length; i++) {
        if (!chatList.includes(vliveData[i].Date)) {
          chatList.push(vliveData[i].Date);
        }
      }
      setChatList(chatList);
      setIsFetching(false);
    }
  }, [ChatList.length, vliveData]);

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!ChatList || ChatList.length === 0) {
        getVlivePromise().then((res) => {
          const vlive = JSON.parse(JSON.stringify(res));
          if (vlive && vlive.length > 0) {
            setVliveData(vlive);
            let chatList = [];
            for (let i = 1; i < vlive.length; i++) {
              if (!chatList.includes(vlive[i].Date)) {
                chatList.push(vlive[i].Date);
              }
            }
            setChatList(chatList);
          }
        });
      }
      setIsFetching(false);
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  return (
    <MobileLayout className="vlive select-none" headerUrl="/">
      <div className="vlive-chat-list flex-col">
        <h2>Loona+ Chats</h2>
        {isFetching ? (
          <LoadingSpinner />
        ) : (
          ChatList &&
          ChatList.length > 0 &&
          ChatList.map((date, index) => (
            <ChatPreview key={`vlive-chat-preview-${index}`} date={date} />
          ))
        )}
      </div>
    </MobileLayout>
  );
}

export default ChatListPage;
