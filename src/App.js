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
// Vlive
import VliveChatListPage from 'Vlive/pages/ChatListPage';
import VliveChatPage from 'Vlive/pages/ChatPage';
// Fab
import FabArtistListPage from 'Fab/pages/ArtistListPage';
import FabArtistPage from 'Fab/pages/ArtistPage';
import FabMessagePage from 'Fab/pages/MessagePage';
import FabChatPage from 'Fab/pages/ChatPage';
import FabSearchPage from 'Fab/pages/SearchPage';
// Fromm
import FrommArtistListPage from 'Fromm/pages/ArtistListPage';
import FrommChatPage from 'Fromm/pages/ChatPage';
import FrommSearchPage from 'Fromm/pages/SearchPage';
import FrommProfilePage from 'Fromm/pages/ProfilePage';
import FrommProfileHistoryPage from 'Fromm/pages/ProfileHistoryPage';

const contextProvider = (service, children) => {
  if (service === 1) return <VliveDataProvider>{children}</VliveDataProvider>;
  if (service === 2) return <FabDataProvider>{children}</FabDataProvider>;
  return <FrommDataProvider>{children}</FrommDataProvider>;
};

function App() {
  return (
    <div className="App-bg">
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route
            path="/vlive"
            element={contextProvider(1, <VliveChatListPage />)}
          />
          <Route
            path="/vlive/:chatDate"
            element={contextProvider(1, <VliveChatPage />)}
          />
          <Route
            path="/fab"
            element={contextProvider(2, <FabArtistListPage />)}
          />
          <Route
            path="/fab/:artistId"
            element={contextProvider(2, <FabArtistPage />)}
          />
          <Route
            path="/fab/:artistId/:chatId"
            element={contextProvider(2, <FabMessagePage />)}
          />
          <Route
            path="/fab/:artistId/:chatId/msg"
            element={contextProvider(2, <FabChatPage />)}
          />
          <Route
            path="/fab/search"
            element={contextProvider(2, <FabSearchPage />)}
          />
          <Route
            path="/fromm"
            element={contextProvider(3, <FrommArtistListPage />)}
          />
          <Route
            path="/fromm/:artistId"
            element={contextProvider(3, <FrommChatPage />)}
          />
          <Route
            path="/fromm/:artistId/search"
            element={contextProvider(3, <FrommSearchPage />)}
          />
          <Route
            path="/fromm/profile/:artistId"
            element={contextProvider(3, <FrommProfilePage />)}
          />
          <Route
            path="/fromm/profile/:artistId/history"
            element={contextProvider(3, <FrommProfileHistoryPage />)}
          />
          <Route component={NotFound} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
