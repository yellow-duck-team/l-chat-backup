import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MediaSlide from 'Fab/components/MediaSlide';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import MobileLayout from 'components/MobileLayout';
import fabArtists from 'assets/fab/artist_info.json';
import { chatByMsgLine } from 'lib/group';
import { useFabDataContext } from 'context/fabDataState';
import { getFabPromise } from 'api/getData';
import { CommentOutlined } from '@ant-design/icons';
import './MessagePage.css';

// Get index of first style
const minStyleIndex = (text, styleType) => {
  let styleIndex = -1;
  let firstStyle = '';
  for (let col = 0; col < styleType.length; col++) {
    const index = text.indexOf(`(${styleType[col]})`);
    if (index >= 0 && (index < styleIndex || styleIndex < 0)) {
      styleIndex = index;
      firstStyle = styleType[col];
    }
  }
  return firstStyle;
};

// Color text
const styleText = (text) => {
  // Get index of first style
  const firstStyle = minStyleIndex(text, [
    'small',
    'big',
    'blue',
    'green',
    'red',
    'pink'
  ]);
  // If text is stylized
  if (firstStyle !== '') {
    let colList = text.split(`(${firstStyle})`);
    const colText = colList[1].split(`(/${firstStyle})`);
    if (colList.length > 2) {
      return (
        <span>
          {colList[0]}
          <span className={`msg-text-${firstStyle}`}>
            {firstStyle === 'big' ? styleText(colText[0]) : colText[0]}
          </span>
          {styleText(colText[1] + colList.slice(2).join(`(${firstStyle})`))};
        </span>
      );
    } else {
      return (
        <span>
          {colList[0]}
          <span className={`msg-text-${firstStyle}`}>
            {firstStyle === 'big' ? styleText(colText[0]) : colText[0]}
          </span>
          {styleText(colText[1])}
        </span>
      );
    }
  }
  return text;
};

/**
 * Message component that has styled text.
 * @param {*} chatId
 * @param {*} CSVText
 * @param {string} artistNum: number of current artist
 * @param {Function} onOpenMedia: function to open media modal when clicked
 * @returns Message component
 */
function Message({ chatId, CSVText, artistNum, onOpenMedia }) {
  const [isLoading, setIsLoading] = useState(true);

  // Show loading spinner until media is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  // Stylize message
  if (chatId === '' || !CSVText || CSVText === [] || CSVText.length === 0) {
    return <p></p>;
  }
  if (CSVText[0] === '') {
    // Message without anything
    return <p></p>;
  }
  // Video
  if (CSVText[0] === '(Video)') {
    return (
      <div className="artist-msg video">
        {isLoading && <LoadingSpinner />}
        <video
          className={isLoading ? 'hidden' : ''}
          width="750"
          height="500"
          controls
          autoPlay
          onLoadedData={onMediaLoad}
        >
          <source
            src={require(`assets/fab/${artistNum}/media/${
              chatId.length === 1 ? '0' + chatId : chatId
            }_0.mp4`)}
            type="video/mp4"
          />
        </video>
      </div>
    );
  }
  // Full Image
  if (CSVText[0] === '(Full Image)') {
    return (
      <div className="artist-msg full-img">
        {isLoading && <LoadingSpinner />}
        <img
          className={isLoading ? 'hidden' : ''}
          src={require(`assets/fab/${artistNum}/media/${
            chatId.length === 1 ? '0' + chatId : chatId
          }_0.jpg`)}
          alt=""
          onLoad={onMediaLoad}
        />
      </div>
    );
  }
  // If text or image text
  const msgText = CSVText[0].split('\n');
  let imgCount = 0;
  for (let i = 0; i < msgText.length; i++) {
    // Image Grid
    if (msgText[i].includes('(Image)')) {
      const lineImgCount = msgText[i].split('(Image)').length - 1;
      const num = imgCount + lineImgCount;
      let msgImg = [];
      let j = imgCount;
      while (j < num) {
        let currImg = j;
        msgImg.push(
          <React.Fragment key={`artist-${artistNum}-img-${i}-${j}`}>
            {isLoading && <LoadingSpinner />}
            <img
              src={require(`assets/fab/${artistNum}/media/${
                chatId.length === 1 ? '0' + chatId : chatId
              }_${j}.jpg`)}
              onClick={() =>
                onOpenMedia(
                  true,
                  require(`assets/fab/${artistNum}/media/${
                    chatId.length === 1 ? '0' + chatId : chatId
                  }_${currImg}.jpg`),
                  `assets/fab/${artistNum}/media/${
                    chatId.length === 1 ? '0' + chatId : chatId
                  }`,
                  currImg,
                  num
                )
              }
              alt=""
              className={isLoading ? 'hidden' : ''}
              onLoad={onMediaLoad}
            />
          </React.Fragment>
        );
        j++;
      }
      msgText[i] = (
        <div
          key={`artist-${artistNum}-text-${i}`}
          className={`artist-msg msg-img-${lineImgCount}`}
        >
          {msgImg}
        </div>
      );
      imgCount = j;
    } else {
      if (msgText[i] === '') {
        msgText[i] = <p key={`msgText-${i}`}> </p>;
      } else {
        // Color and Size
        msgText[i] = styleText(msgText[i]);
        msgText[i] = <p key={`msgText-${i}`}>{msgText[i]}</p>;
      }
    }
  }
  return <div className="msg-text">{msgText}</div>;
}

function MessagePage() {
  const { fabData, setFabData } = useFabDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [ArtistNum, setArtistNum] = useState('');
  const [ProfileImg, setProfileImg] = useState('');
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
    const profileImg = require(`assets/fab/${artistNum}/profile/0.jpg`);
    setProfileImg(profileImg);
  }, [location.pathname]);

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

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!ArtistNum || ArtistNum === '') return;
      if (!CSVText || CSVText === [] || CSVText.length === 0) {
        getFabPromise(ArtistNum).then((res) => {
          const fab = JSON.parse(JSON.stringify(res));
          if (fab && fab.length > 0) {
            setFabData(fab);
            // Get text data by message
            const { text, replyCount } = chatByMsgLine(ChatId, fab);
            setCSVText(text[0]);
            setReplyCount(replyCount);
          }
        });
      }
      setIsFetching(false);
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  // Media slide
  const onOpenMedia = (open, media, path, currImg, imgCount) => {
    if (open && path && path !== '') {
      setMedia({
        media: media,
        path: path,
        currImg: currImg,
        imgCount: imgCount
      });
    } else {
      setMedia(null);
    }
    setOpenMedia(open);
  };

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
            <img src={ProfileImg} className="artist-profile" alt="" />
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
