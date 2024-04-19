// Group data by key
export const groupByKey = (xs, key) => {
  if (!xs || xs.length === 0) return [];
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

// Group data by date
export const groupByDate = (date, key, data, isNull = false) => {
  // If data is invalid
  if (!data || data.length === 0) return [];
  // If date is valid
  if (date && date.length > 0) {
    const dataByKey = groupByKey(data, key);
    // group data by date
    const dataByDate = dataByKey[date.join('.')];
    if (dataByDate && dataByDate.length > 0) {
      return dataByDate;
    }
    if (isNull) return [];
  }
  return data;
};

// Get chat object by date
export const chatObjByDate = (data, date, dateStr) => {
  let chatList = [];
  for (let i = 1; i < data.length; i++) {
    if (dateStr === data[i].date) {
      chatList.push({
        date: date,
        text: data[i].text,
        type: data[i].type
      });
    } else if (chatList.length > 0) {
      break;
    }
  }
  return chatList;
};

// Get text data by message
export const chatByMsg = (data) => {
  let dataByMsg = [];
  let i = 0;
  while (i < data[0].length) {
    if (data[0][i] === '') break;
    // Get text data by line
    dataByMsg.push({
      msgNum: data[0][i],
      data: data[2].slice(i, i + 4)
    });
    i += 4;
  }
  return dataByMsg;
};

const countReply = (data, index) => {
  // i, i + 4
  let count = 0;
  while (count < data.length && data[count][index] !== '') {
    count++;
  }
  return count;
};

// Get text data by message by line
export const chatByMsgLine = (chatId, data, searchText = null) => {
  let text = [];
  let replyCount = 0;
  let dataByText = [];
  for (let i = 0; i < data[0].length; i += 4) {
    // Get text data by line
    if (chatId === null || chatId === data[0][i]) {
      let dataByLine = [];
      for (let j = 2; j < data.length; j++) {
        const slicedText = data[j].slice(i, i + 4);
        if (slicedText[2] === '') {
          // Empty line
          break;
        }
        if (searchText === null) {
          dataByLine.push(slicedText);
        } else {
          if (slicedText[2] === 'Text' || slicedText[2] === 'Reply') {
            if (slicedText[0].includes(searchText)) {
              dataByText.push({
                chatId: data[0][i],
                chatDate: slicedText[3],
                chatText: slicedText
              });
            }
          }
        }
      }
      if (searchText === null) {
        text = dataByLine;
        replyCount = countReply(data.slice(3, data.length), i);
        break;
      }
    }
  }
  if (text.length === 0) text = dataByText;
  return { text, replyCount };
};

// Get text data by search text
export const searchText = (data, text) => {
  let dataArr = [];
  for (let i = 1; i < data.length - 1; i++) {
    const slicedText = data[i].text;
    if (!slicedText || slicedText === '') break;
    if (data[i].type === 'Text' && slicedText.includes(text)) {
      dataArr.push(data[i]);
    }
  }
  return dataArr;
};
