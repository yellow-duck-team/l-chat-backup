import React from 'react';
import { formatDate } from 'lib/date';
import '../pages/ChatPage.css';

function Date({ date, index }) {
  return (
    <div
      className={`chat-date flex-center select-none ${
        index === 0 && 'first-date'
      }`}
    >
      <div className="chat-date-text flex-center select-none">
        {formatDate(date)}
      </div>
    </div>
  );
}

export default Date;
