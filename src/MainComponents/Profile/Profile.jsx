import React, {useContext, useEffect, useState} from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu/Menu';

import Chats from "./Chats/Chats";
import Messenger from "./Messenger/Messenger";
import {ThemeMenu} from "../../NewChat/ContextForMenu/ContextForMenu";

const Profile = () => {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);
    const {createNewChat,setIsCreateChat} =useContext(ThemeMenu)



    const redirectTo = (url) => {
        navigate(url);
    };
    useEffect(() => {
        if(createNewChat===false)
            setMenuActive(false)
    }, [createNewChat]);
    const activeMenu =()=>{
        setMenuActive(!menuActive)
        setTimeout(() => {
            // Второе действие: переключаем состояние создания нового чата
            setIsCreateChat(false);
        }, 1050); // Задержка в миллисекундах (1000ms = 1 секунда)
    }
    useEffect(() => {
        setTimeout(() => {
        if(menuActive===false)
           setIsCreateChat(false)
        }, 1050);
    }, [menuActive]);


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
            <div className={menuActive ? 'blur active' : 'blur'} onClick={() => activeMenu()}/>
            <div className="text">описание картинки</div>
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
