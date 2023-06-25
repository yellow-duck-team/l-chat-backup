import React, { useEffect, useState } from 'react';
import { convertDate } from 'lib/date';
import './Date.css';

function Date(props) {
  const [ChatDate, setChatDate] = useState('');

  useEffect(() => {
    if (props.chatDate) {
      const chatDate = props.chatDate;
      const year = chatDate.slice(0, 4);
      const month = chatDate.slice(5, 7);
      const date = chatDate.slice(8, 10);
      setChatDate(`${year}.${month}.${date}.`);
    }
  }, [props]);

  return <div className="date">{convertDate(ChatDate)}</div>;
}

export default Date;
