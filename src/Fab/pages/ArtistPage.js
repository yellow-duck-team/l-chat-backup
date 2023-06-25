import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertDate } from 'App';
import { getFabPromise } from 'api/getData';
import { chatByMsg } from 'lib/group';
import { useFabDataContext } from 'context/fabDataState';
import fabArtists from 'assets/fab/artist_info.json';
import Header from 'components/Header/Header';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import './ArtistPage.css';
import EmptyList from 'components/EmptyList';

function FabMsgImg({ artistNum, data }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const onClickThumbnail = (msgNum) => {
    navigate(`/fab/${artistNum}/${msgNum}`);
  };

  // Show loading spinner until media is successfully loaded
  const onMediaLoad = () => {
    setIsLoading(false);
  };

  // Message without media
  if (data.data[0] !== '(Video)' && !data.data[0].includes('Image')) {
    const emptyImg = require(`assets/fab/empty.jpg`);
    return (
      <div
        className="artist-msg select-none"
        onClick={() => onClickThumbnail(data.msgNum)}
      >
        <p>{convertDate(data.data[3].slice(0, 10))}</p>
        {isLoading && <LoadingSpinner />}
        <img
          className={isLoading ? 'hidden' : ''}
          src={emptyImg}
          alt=""
          onLoad={onMediaLoad}
        />
      </div>
    );
  }

  let msgNum = data.msgNum;
  if (msgNum.length === 1) msgNum = '0' + msgNum;
  let artistMedia = null;
  if (data.data[0] === '(Video)') {
    // Message with a video
    const artistVideo = require(`assets/fab/${artistNum}/media/${msgNum}_0.mp4`);
    artistMedia = (
      <video
        className={isLoading ? 'hidden' : ''}
        width="750"
        height="500"
        onLoadedData={onMediaLoad}
      >
        <source src={artistVideo} type="video/mp4" />
      </video>
    );
  } else {
    // Message with an image
    const artistImg = require(`assets/fab/${artistNum}/media/${msgNum}_0.jpg`);
    artistMedia = (
      <img
        className={isLoading ? 'hidden' : ''}
        src={artistImg}
        alt=""
        onLoad={onMediaLoad}
      />
    );
  }

  return (
    <div
      className="artist-msg select-none"
      onClick={() => onClickThumbnail(data.msgNum)}
    >
      <p>{convertDate(data.data[3].slice(0, 10))}</p>
      {isLoading && <LoadingSpinner />}
      {artistMedia}
    </div>
  );
}

function ArtistPage() {
  const { fabData, setFabData } = useFabDataContext();
  const location = useLocation();

  const [ArtistNum, setArtistNum] = useState('');
  const [ProfileImg, setProfileImg] = useState('');
  const [BGImg, setBGImg] = useState('');
  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // Get artist profile info
  useEffect(() => {
    const chatId = location.pathname.split('/')[2];
    setArtistNum(chatId);
    const profileImg = require(`assets/fab/${chatId}/profile/0.jpg`);
    setProfileImg(profileImg);
    const bgImg = require(`assets/fab/${chatId}/bg/0.jpg`);
    setBGImg(bgImg);
  }, [location.pathname]);

  useEffect(() => {
    // Missing artist number
    if (!ArtistNum || ArtistNum === '') return;
    // Already fetched data
    if (CSVText.length > 0) {
      setIsFetching(false);
      return;
    }
    // Fetch data
    setIsFetching(true);
    if (fabData && Object.keys(fabData).length === 2) {
      if (fabData[ArtistNum] && fabData[ArtistNum].length > 0) {
        setCSVText(chatByMsg(fabData[ArtistNum]));
      }
      setIsFetching(false);
    }
  }, [ArtistNum, CSVText.length, fabData]);

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!ArtistNum || ArtistNum === '') return;
      if (!CSVText || CSVText.length === 0) {
        getFabPromise(ArtistNum).then((res) => {
          const fab = JSON.parse(JSON.stringify(res));
          if (fab && fab.length > 0) {
            setFabData(fab);
            setCSVText(chatByMsg(fab));
          }
        });
      }
      setIsFetching(false);
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  const fabMsgGrid = () => {
    const rows = [];
    for (let i = 0; i < CSVText.length; i += 3) {
      rows.push(
        <div key={`artist-msg-row-${i / 3}`} className="flex-row">
          {i < CSVText.length && (
            <FabMsgImg
              key={`artist-msg-${i}`}
              artistNum={ArtistNum}
              data={CSVText[i]}
            />
          )}
          {i + 1 < CSVText.length ? (
            <FabMsgImg
              key={`artist-msg-${i + 1}`}
              artistNum={ArtistNum}
              data={CSVText[i + 1]}
            />
          ) : (
            <div className="artist-msg select-none"></div>
          )}
          {i + 2 < CSVText.length ? (
            <FabMsgImg
              key={`artist-msg-${i + 2}`}
              artistNum={ArtistNum}
              data={CSVText[i + 2]}
            />
          ) : (
            <div className="artist-msg select-none"></div>
          )}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="artistpage flex-col flex-center select-none">
      <Header url="/fab" />
      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <div className="artistpage-body">
          <div className="top">
            <img src={ProfileImg} className="artist-profile" alt="" />
            <div className="artist-background">
              <img src={BGImg} alt="" />
            </div>
            <div className="profile-name flex-row">
              <p>{ArtistNum !== '' ? fabArtists[ArtistNum].name : ''}</p>
            </div>
          </div>
          <div className="artist-body flex-col">
            {CSVText && CSVText.length > 1 ? (
              fabMsgGrid()
            ) : (
              <EmptyList listType="Message history" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistPage;
