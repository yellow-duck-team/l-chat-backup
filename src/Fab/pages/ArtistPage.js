import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertDate } from 'lib/date';
import { chatByMsg } from 'lib/group';
import { fabSources } from 'lib/fabMedia';
import { useFabDataContext } from 'context/fabDataState';
import fabArtists from 'assets/fab/artist_info.json';
import Video from 'Fab/components/Video';
import Header from 'components/Header/Header';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ImageMedia from 'components/ImageMedia';
import EmptyList from 'components/EmptyList';
import './ArtistPage.css';

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
  if (msgNum.length === 1) {
    msgNum = '0' + msgNum;
  }

  let artistMedia = null;

  if (data.data[0] === '(Video)') {
    // Message with a video
    artistMedia = (
      <Video
        sources={fabSources(`${artistNum}/media/${msgNum}_0.mp4`)}
        className={isLoading ? 'hidden' : ''}
        width="750"
        height="500"
        onLoadedData={onMediaLoad}
      />
    );
  } else {
    // Message with an image
    artistMedia = (
      <ImageMedia
        sources={fabSources(`${artistNum}/media/${msgNum}_0.jpg`)}
        className={isLoading ? 'hidden' : ''}
        alt=""
        onLoad={onMediaLoad}
        onError={onMediaLoad}
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
  const { fabData, fabProfile } = useFabDataContext();
  const location = useLocation();

  const [ArtistNum, setArtistNum] = useState('');
  const [ProfileImg, setProfileImg] = useState([]);
  const [BGImg, setBGImg] = useState([]);
  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const chatId = location.pathname.split('/')[2];
    setArtistNum(chatId);
  }, [location.pathname]);

  // Current profile and bg from the fab-profile sheet
  useEffect(() => {
    const p = fabProfile[ArtistNum];
    if (p) {
      setProfileImg(p.profile);
      setBGImg(p.background);
    }
  }, [ArtistNum, fabProfile]);

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
            <ImageMedia
              sources={ProfileImg}
              className="artist-profile"
              alt=""
            />
            <div className="artist-background">
              <ImageMedia sources={BGImg} alt="" />
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
