import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Message from 'Fab/components/Message';
import MediaSlide from 'components/MediaSlide/MediaSlide';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import MobileLayout from 'components/MobileLayout';
import ImageMedia from 'components/ImageMedia';
import fabArtists from 'assets/fab/artist_info.json';
import { chatByMsgLine } from 'lib/group';
import { useFabDataContext } from 'context/fabDataState';
import { CommentOutlined } from '@ant-design/icons';
import './MessagePage.css';

function MessagePage() {
  const { fabData, fabProfile, media, openMedia, onOpenMedia } =
    useFabDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [ArtistNum, setArtistNum] = useState('');
  const [ProfileImg, setProfileImg] = useState([]);
  const [ChatId, setChatId] = useState('');
  const [CSVText, setCSVText] = useState([]);
  const [ReplyCount, setReplyCount] = useState(0);
  const [Media, setMedia] = useState(null);
  const [OpenMedia, setOpenMedia] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const artistNum = location.pathname.split('/')[2];
    const chatId = location.pathname.split('/')[3];

    setArtistNum(artistNum);
    setChatId(chatId);
  }, [location.pathname]);

  // Current profile from the fab-profile sheet
  useEffect(() => {
    if (fabProfile[ArtistNum]) {
      setProfileImg(fabProfile[ArtistNum].profile);
    }
  }, [ArtistNum, fabProfile]);

  useEffect(() => {
    // Missing artist number or chat ID
    if (!ArtistNum || ArtistNum === '' || ChatId === '') return;
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
        const { text, replyCount } = chatByMsgLine(ChatId, fabData[ArtistNum]);
        setCSVText(text[0]);
        setReplyCount(replyCount);
      }
      setIsFetching(false);
    }
  }, [ArtistNum, ChatId, CSVText.length, fabData]);

  useEffect(() => {
    setMedia(media);
    setOpenMedia(openMedia);
  }, [media, openMedia]);

  const onChatPage = () => {
    navigate(`/fab/${ArtistNum}/${ChatId}/msg`);
  };

  return (
    <MobileLayout className="fab fab-msgpage" headerUrl={`/fab/${ArtistNum}/`}>
      <div className="msgpage">
        {OpenMedia && Media && (
          <MediaSlide openMedia={() => onOpenMedia()} media={Media} />
        )}
        {isFetching ? (
          <LoadingSpinner />
        ) : (
          <div className="msg-body">
            {ChatId !== '' && CSVText && CSVText.length > 0 && (
              <Message
                chatId={ChatId}
                CSVText={CSVText}
                artistNum={ArtistNum}
                onOpenMedia={onOpenMedia}
              />
            )}
          </div>
        )}
        <div className="msg-footer select-none">
          <div className="footer-left">
            <ImageMedia
              sources={ProfileImg}
              className="artist-profile"
              alt=""
            />
            <div className="footer-text">
              <p className="profile-name">
                {ArtistNum !== '' ? fabArtists[ArtistNum].name : ''}
              </p>
              {CSVText && CSVText.length > 0 && <p>{CSVText[3]}</p>}
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-icon" onClick={onChatPage}>
              <CommentOutlined />
            </div>
            <p>댓글 ({ReplyCount})</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default MessagePage;
