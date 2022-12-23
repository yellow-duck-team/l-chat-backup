import { Route, Routes } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
// Components
import ArtistListPage from './components/ArtistListPage/ArtistListPage';
import ArtistPage from './components/ArtistPage/ArtistPage';
import MessagePage from './components/MessagePage/MessagePage';
import ChatPage from './components/ChatPage/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/l-chat-backup' element={<ArtistListPage />} />
        <Route path='/l-chat-backup/chat' element={<ArtistPage />} />
        <Route path='/l-chat-backup/chat/:chatId' element={<MessagePage />} />
        <Route path='/l-chat-backup/chat/:chatId/msg' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;