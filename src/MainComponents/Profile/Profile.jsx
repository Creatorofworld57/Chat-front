import React, {  useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu/Menu';

import Chats from "./Chats/Chats";
import Messenger from "./Messenger/Messenger";

const Profile = () => {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);




    const redirectTo = (url) => {
        navigate(url);
    };



    return (
        <div>
            <nav>
                <div className='burger-btn' onClick={() => setMenuActive(!menuActive)}>
                    <span className={menuActive ? 'line1 active' : 'line1'}/>
                    <span className={menuActive ? 'line2 active' : 'line2'}/>
                    <span className={menuActive ? 'line3 active' : 'line3'}/>
                </div>
            </nav>


            <button className="back_up" onClick={() => redirectTo('/home')}></button>

            <Menu active={menuActive} setActive={setMenuActive}/>
            <div className="chats-container">
                <Chats/>
            </div>
            <div className="messanger-container">
            <Messenger/>
                </div>

        </div>
    );
};

export default Profile;
