import { Route, Routes } from 'react-router-dom';
import './App.css';
// Context
import { FabDataProvider } from 'context/fabDataState';
import { FrommDataProvider } from 'context/frommDataState';
import { VliveDataProvider } from 'context/vliveDataState';
// Components
import NavBar from 'components/NavBar/NavBar';
import NotFound from 'components/NotFound';
import HomePage from 'pages/HomePage';
// Fab
import FabArtistListPage from 'Fab/pages/ArtistListPage';
import FabArtistPage from 'Fab/pages/ArtistPage';
import FabMessagePage from 'Fab/pages/MessagePage';
import FabChatPage from 'Fab/pages/ChatPage';
import FabSearchPage from 'Fab/pages/SearchPage';
// Vlive
import VliveChatListPage from 'Vlive/pages/ChatListPage';
import VliveChatPage from 'Vlive/pages/ChatPage';
// Fromm
import FrommArtistListPage from 'Fromm/pages/ArtistListPage';
import FrommChatPage from 'Fromm/pages/ChatPage';
import FrommSearchPage from 'Fromm/pages/SearchPage';

export const convertDate = (date) => {
  if (date === '') return '';
  let dateText = date.split('.');
  if (dateText[1].length < 2) dateText[1] = '0' + dateText[1];
  if (dateText[2].length < 2) dateText[2] = '0' + dateText[2];
  return `${dateText[0]}년 ${dateText[1]}월 ${dateText[2]}일`;
};

function App() {
  return (
    <VliveDataProvider>
      <FabDataProvider>
        <FrommDataProvider>
          <div className="App-bg">
            <div className="App">
              <NavBar />
              <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/vlive" element={<VliveChatListPage />} />
                <Route path="/vlive/:chatDate" element={<VliveChatPage />} />
                <Route path="/fab" element={<FabArtistListPage />} />
                <Route path="/fab/:artistId" element={<FabArtistPage />} />
                <Route
                  path="/fab/:artistId/:chatId"
                  element={<FabMessagePage />}
                />
                <Route
                  path="/fab/:artistId/:chatId/msg"
                  element={<FabChatPage />}
                />
                <Route path="/fab/search" element={<FabSearchPage />} />
                <Route path="/fromm" element={<FrommArtistListPage />} />
                <Route path="/fromm/:artistId" element={<FrommChatPage />} />
                <Route
                  path="/fromm/:artistId/search"
                  element={<FrommSearchPage />}
                />
                <Route component={NotFound} />
              </Routes>
            </div>
          </div>
        </FrommDataProvider>
      </FabDataProvider>
    </VliveDataProvider>
  );
}

export default App;
