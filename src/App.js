import { Route, Routes } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
// Components
import ArtistListPage from './components/ArtistListPage/ArtistListPage';
import ArtistPage from './components/ArtistPage/ArtistPage';
import MessagePage from './components/MessagePage/MessagePage';
import ChatPage from './components/ChatPage/ChatPage';
import SearchPage from './components/SearchPage/SearchPage';

export const convertDate = (date) => {
  if (date === "") return "";
  let dateText = date.split(".");
  if (dateText[1].length < 2) dateText[1] = "0" + dateText[1];
  if (dateText[2].length < 2) dateText[2] = "0" + dateText[2];
  return `${dateText[0]}년 ${dateText[1]}월 ${dateText[2]}일`;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/l-chat-backup' element={<ArtistListPage />} />
        <Route path='/l-chat-backup/chat/:artistId' element={<ArtistPage />} />
        <Route path='/l-chat-backup/chat/:artistId/:chatId' element={<MessagePage />} />
        <Route path='/l-chat-backup/chat/:artistId/:chatId/msg' element={<ChatPage />} />
        <Route path='/l-chat-backup/search' element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default App;