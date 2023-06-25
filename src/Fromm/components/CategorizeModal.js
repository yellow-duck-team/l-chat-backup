import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { groupByKey } from 'lib/group';
import { useFrommDataContext } from 'context/frommDataState';
import '../pages/ArtistListPage.css';
import { getFrommPromise } from 'api/getData';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

/**
 * Categorize modal component.
 * @param {number} artistNum
 * @param {Function} showModal
 * @param {boolean} isHidden
 * @returns Categorize modal component
 */
function CategorizeModal({ artistNum, showModal, isHidden }) {
  const { frommData, setFrommData } = useFrommDataContext();
  const navigate = useNavigate();

  const [Categorize, setCategorize] = useState(false);
  const [CSVText, setCSVText] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Missing artist number
    if (!Categorize || artistNum === null) return;
    // Already fetched data
    if (CSVText.length > 0) {
      setIsFetching(false);
      return;
    }
    // Fetch data
    if (frommData && Object.keys(frommData).length === 3) {
      if (frommData[artistNum] && frommData[artistNum].length > 0) {
        setCSVText(Object.keys(groupByKey(frommData[artistNum], 'Date')));
      }
      setIsFetching(false);
    }
  }, [Categorize, CSVText.length, frommData, artistNum]);

  // If data cannot be pulled from context API
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!artistNum || artistNum === '' || CSVText.length === 0) return;
      getFrommPromise(artistNum).then((res) => {
        const fromm = JSON.parse(JSON.stringify(res));
        if (fromm && fromm.length > 0) {
          setFrommData(fromm);
          setCSVText(Object.keys(groupByKey(fromm, 'Date')));
        }
        setIsFetching(false);
      });
    }, 3000);
    // Cleanup the timer when component unmouts
    return () => clearTimeout(timerId);
  });

  const onClickCategory = (e, category) => {
    // Prevent bubbling
    e.preventDefault();
    e.stopPropagation();
    // Navigate by categorization
    if (category === 1) navigate(`/fromm/${artistNum}`);
    if (category === 2) setCategorize(true);
    if (category === 3) navigate(`/fromm/${artistNum}/search`);
  };

  const onClickDate = (e, date) => {
    // Prevent bubbling
    e.preventDefault();
    e.stopPropagation();
    // Navigate by date
    if (date !== '' && date.length > 0)
      navigate(`/fromm/${artistNum}?date=${date.split('.').join('-')}`);
  };

  const onCancelCategory = () => {
    showModal(null);
    setCategorize(false);
  };

  return (
    <div
      className={`categorize-modal-bg flex-center select-none ${
        isHidden ? 'hidden' : ''
      }`}
      onClick={onCancelCategory}
    >
      {Categorize && CSVText && CSVText !== [] ? (
        isFetching ? (
          <LoadingSpinner />
        ) : (
          <div className="categorize-modal categorize-modal-date flex-col">
            {CSVText.map((date, index) => (
              <div
                key={`category-date-${index}`}
                className="category-btn date-btn flex-center"
                onClick={(e) => onClickDate(e, date)}
              >
                {date}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="categorize-modal flex-col">
          <div
            className="category-btn flex-center"
            onClick={(e) => onClickCategory(e, 1)}
          >
            전체 채팅 보기
          </div>
          <div
            className="category-btn flex-center"
            onClick={(e) => onClickCategory(e, 2)}
          >
            날짜 별로 보기
          </div>
          <div
            className="category-btn flex-center"
            onClick={(e) => onClickCategory(e, 3)}
          >
            댓글 검색
          </div>
        </div>
      )}
    </div>
  );
}

export default CategorizeModal;
