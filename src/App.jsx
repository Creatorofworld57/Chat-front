import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Welcome from './MainComponents/MainPage/Welcome';
import Loginpage from './MainComponents/Entry/Loginpage';
import NotFoundPage from './MainComponents/NotFound/NotFoundPage';
import Profile from './MainComponents/Profile/Profile';
import UserForm from './MainComponents/Registration/RegisterPage';



import './Styles/Audio.css';
import AudioPlaylist from './AudioPlaylist';
import { AudioUpload } from './AudioUpload';
import PrivateRoute from './PrivateRoutes/PrivateRoute';
import ContextForAudio from './HelperModuls/ContextForAudio';
import Playlist from './MainComponents/Profile/Chats/Chats';
import Home from "./MainComponents/Home/Home";

import ThemeContext from "./HelperModuls/ThemeContext";
import ContextForMenu from "./NewChat/ContextForMenu/ContextForMenu";
import Update from "./Update/Update";

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
                        <Route element={<PrivateRoute />}>
                            <Route path="/update" element={<Update/>} />

                            <Route path="/profile" element={<ContextForMenu><Profile />   </ContextForMenu>} />

                            <Route path="/home" element={<Welcome />} />
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