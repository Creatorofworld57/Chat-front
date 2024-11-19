import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Welcome from './MainComponents/MainPage/Welcome';
import Loginpage from './MainComponents/Entry/Loginpage';
import NotFoundPage from './MainComponents/NotFound/NotFoundPage';
import Profile from './MainComponents/Profile/Profile';
import UserForm from './MainComponents/Registration/RegisterPage';

import AudioPlaylist from './AudioPlaylist';
import { AudioUpload } from './AudioUpload';
import PrivateRoute from './PrivateRoutes/PrivateRoute';

import Playlist from './MainComponents/Profile/Chats/Chats';
import Home from "./MainComponents/Home/Home";

import ThemeContext from "./HelperModuls/ThemeContext";
import ContextForMenu from "./NewChat/ContextForMenu/ContextForMenu";
import Update from "./Update/Update";
import ChatContext from "./HelperModuls/ChatContext";

const App = () => {

    return (

            <ThemeContext>
            <Router>
                    <Routes>
                        <Route path="/login" element={<Loginpage />} />
                        <Route path="*" element={<NotFoundPage />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/reg" element={<UserForm />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/update" element={<Update/>} />
                            <Route path="/profile" element={<ContextForMenu><ChatContext> <Profile /> </ChatContext>  </ContextForMenu>} />
                            <Route path="/home" element={<Welcome />} />
                            <Route path="/profile/playlist" element={<Playlist />} />
                            <Route path="/audio_upload" element={<AudioUpload />} />
                            <Route path="/audio_playlist" element={<AudioPlaylist />} />
                        </Route>
                    </Routes>
            </Router>
            </ThemeContext>


    );
};

export default App;