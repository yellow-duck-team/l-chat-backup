import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from 'Fromm/components/Profile';
import ChatBubble from 'components/ChatBubble/ChatBubble';
import Date from 'Fromm/components/Date';
import MediaSlide from 'components/MediaSlide/MediaSlide';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import EmptyList from 'components/EmptyList';
import MobileLayout from 'components/MobileLayout';
import { formatTime } from 'lib/date';
import { groupByDate } from 'lib/group';
import { useFrommDataContext } from 'context/frommDataState';
import './ChatPage.css';

export function Chat({ artistNum, chatData, chat, index, isChatList }) {
  const chatDate = () => {
    if (index !== 0) {
      const prevChat = chatData[index - 1];
      if (prevChat.type === 'Default' || prevChat.date !== chat.date) {
        return <Date date={chat.date} />;
      }
    } else if (chatData[index].type !== 'Default') {
      return <Date date={chat.date} index={index} />;
    }
  };

  return (
    <div className="chat">
      {isChatList && chatDate()}
      <div className="chat-piece flex-row">
        <Profile artistNum={artistNum} imgNum={chat.profile} />
        <div className="chat-r">
          <p className="artist-name select-none">{chat.name}</p>
          <div className="chat-r-b flex-row">
            <ChatBubble
              service="fromm"
              artistNum={artistNum}
              dateStr={chat.date}
              text={chat.text}
              type={chat.type}
              mediaurl={chat.mediaurl}
              extension={chat.extension}
            />
            <p className="bubble-time flex-col select-none">
              {formatTime(chat.time)}
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
      chat.date === '' ||
      chat.text === '' ||
      chat.type === '' ||
      chat.name === '' ||
      chat.profile === '' ||
      chat.background === ''
    )
      return <></>;

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
  const { frommData, media, openMedia, onOpenMedia } = useFrommDataContext();
  const location = useLocation();

  const [ArtistNum, setArtistNum] = useState('');
  const [QueryDate, setQueryDate] = useState([]);
  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [Media, setMedia] = useState(null);
  const [OpenMedia, setOpenMedia] = useState(false);

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
    if (!isFetching) return;
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
        setCSVText(groupByDate(QueryDate, 'date', frommData[ArtistNum], true));
      }
      setIsFetching(false);
    }
  }, [ArtistNum, QueryDate, CSVText.length, frommData]);

  useEffect(() => {
    setMedia(media);
    setOpenMedia(openMedia);
  }, [media, openMedia]);

  const moreButtonAction = [
    {
      action: 'navigate',
      url: `/fromm/profile/${ArtistNum}`,
      text: '프로필 보기'
    },
    {
      action: 'navigate',
      url: `/fromm/${ArtistNum}`,
      text: '전체 채팅 보기'
    },
    {
      action: 'dateSelect',
      url: `/fromm/${ArtistNum}`,
      date: QueryDate,
      text: '날짜 선택'
    },
    {
      action: 'navigate',
      url: `/fromm/${ArtistNum}/search`,
      text: '댓글 검색'
    }
  ];

  const isLoading = isFetching;

  return (
    <MobileLayout
      className="fromm chatpage-media"
      headerUrl="/fromm"
      moreButtonAction={moreButtonAction}
    >
      {OpenMedia && Media && onOpenMedia && (
        <MediaSlide openMedia={() => onOpenMedia()} media={Media} />
      )}
      <div className="chatpage">
        {isLoading ? (
          <LoadingSpinner />
        ) : CSVText && CSVText.length > 0 ? (
          <Chats artistNum={ArtistNum} chatData={CSVText} />
        ) : (
          <EmptyList darkMode />
        )}
      </div>
    </MobileLayout>
  );
}

export default ChatPage;
