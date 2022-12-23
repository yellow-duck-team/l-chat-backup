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
        <Route exact path='/' element={<ArtistListPage />} />
        <Route path='/chat' element={<ArtistPage />} />
        <Route path='/chat/:chatId' element={<MessagePage />} />
        <Route path='/chat/:chatId/msg' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;