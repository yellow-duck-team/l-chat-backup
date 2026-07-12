// Group data by key
export const groupByKey = (xs, key) => {
  if (!xs || xs.length === 0) return [];
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

// Fromm - Group data by date
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

// Fromm - Get chat object by date
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

// Fab - A grouped bubble to the legacy [text, reply, type, date] shape
const lineArr = (line) => [
  line.text || '',
  line.reply || '',
  line.type || '',
  line.date || ''
];

// Fab - Feed - one entry per message, using its first bubble (the main post)
export const chatByMsg = (messages) => {
  if (!messages || messages.length === 0) return [];
  return messages
    .filter((m) => m.lines && m.lines.length > 0)
    .map((m) => ({ msgNum: m.msg, data: lineArr(m.lines[0]) }));
};

// Bubbles for one message, or search matches across every message
export const chatByMsgLine = (chatId, messages, searchText = null) => {
  if (!messages || messages.length === 0) {
    return searchText === null ? { text: [], replyCount: 0 } : { text: [] };
  }

  // Search matching text bubbles
  if (searchText !== null) {
    const results = [];
    for (const m of messages) {
      for (const line of m.lines) {
        if (
          (line.type === 'Text' || line.type === 'Reply') &&
          line.text &&
          line.text.includes(searchText)
        ) {
          results.push({
            chatId: m.msg,
            chatDate: line.date,
            chatText: lineArr(line)
          });
        }
      }
    }
    return { text: results };
  }

  // A single message
  const m = messages.find((x) => String(x.msg) === String(chatId));
  if (!m) {
    return { text: [], replyCount: 0 };
  }

  return {
    text: m.lines.map(lineArr),
    replyCount: Math.max(0, m.lines.length - 1)
  };
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
