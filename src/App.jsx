import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Welcome from './Welcome';
import Loginpage from './Loginpage';
import NotFoundPage from './NotFoundPage';
import Profile from './Profile';
import UserForm from './RegisterPage';



import './Styles/Audio.css';
import AudioPlaylist from './AudioPlaylist';
import { AudioUpload } from './AudioUpload';
import PrivateRoute from './PrivateRoutes/PrivateRoute';
import ContextForAudio from './HelperModuls/ContextForAudio';
import Playlist from './Chats';
import Home from "./Home";
import Messenger from "./Messenger";
import ThemeContext from "./HelperModuls/ThemeContext";

const App = () => {

    return (
        <ContextForAudio>
            <ThemeContext>
            <Router>
                    <Routes>
                        <Route path="/login" element={<Loginpage />} />
                        <Route path="*" element={<NotFoundPage />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/reg" element={<UserForm />} />
                        <Route path="/update" element={<Messenger />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/home" element={<Welcome />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/profile/playlist" element={<Playlist />} />
                            <Route path="/audio_upload" element={<AudioUpload />} />
                            <Route path="/audio_playlist" element={<AudioPlaylist />} />
                        </Route>
                    </Routes>
            </Router>
            </ThemeContext>
        </ContextForAudio>

    );
};

export default App;