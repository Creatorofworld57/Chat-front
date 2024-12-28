import React, {useContext, useEffect, useState} from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu/Menu';

import Chats from "./Chats/Chats";
import Messenger from "./Messenger/Messenger";
import {ThemeMenu} from "../../NewChat/ContextForMenu/ContextForMenu";
import {ChatCon} from "../../HelperModuls/ChatContext";

const Profile = () => {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);
    const {createNewChat,setIsCreateChat} =useContext(ThemeMenu)
    const [showMessenger, setShowMessenger] = useState(true);
    const [showChats, setShowChats] = useState(true);
    const { chatId} = useContext(ChatCon)
    // Функция для проверки ширины окна
    const checkWindowSize = () => {
        if (window.innerWidth <= 868 && chatId!==0) {
            console.log(chatId +"first")
            setShowChats(false)
            setShowMessenger(true)

        }

        else if (window.innerWidth <= 868 && chatId===0){
            console.log(chatId +"second")
            setShowChats(true)
            setShowMessenger(false)
        }

        else {
            console.log(chatId +"third")
            setShowChats(true);
            setShowMessenger(true)
        }
    };


    useEffect(() => {
        if (window.innerWidth <= 868 && chatId !==0) {
            setShowChats(false)
            setShowMessenger(true)
        }
    }, [chatId]);

    useEffect(() => {
        // Проверить размер окна при загрузке компонента
        checkWindowSize();

        // Добавить обработчик события изменения размера окна
        window.addEventListener('resize', checkWindowSize);

        // Очистить обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);


    const redirectTo = (url) => {
        navigate(url);
    };
    useEffect(() => {
        if(createNewChat===0)
            setMenuActive(false)
    }, [createNewChat]);
    const activeMenu =()=>{
        setMenuActive(!menuActive)
            // Второе действие: переключаем состояние создания нового чата
            setIsCreateChat(0)
      // Задержка в миллисекундах (1000ms = 1 секунда)
    }
    useEffect(() => {

        if(menuActive===false)
           setIsCreateChat(0)

    }, [menuActive]);
   const changer = ()=>{
       setShowChats(!showChats)
       setShowMessenger(!showMessenger)

   }

    return (
        <div>
            <nav>
                <div className='burger-btn' onClick={() => setMenuActive(!menuActive)}>
                    <span className={menuActive ? 'line1 active' : 'line1'}/>
                    <span className={menuActive ? 'line2 active' : 'line2'}/>
                    <span className={menuActive ? 'line3 active' : 'line3'}/>
                </div>
            </nav>
            <div className={menuActive ? 'blur active' : 'blur'} onClick={() => activeMenu()}/>

            <Menu active={menuActive} setActive={setMenuActive}/>
            {showChats &&  <div className="chats-container">
                <Chats/>
            </div>}
            {showMessenger && <div className="messanger-container">
                <Messenger/>
            </div>}
            {(!showMessenger && showChats || showMessenger && !showChats) && <button className="back_up" onClick={() =>changer()}></button>}
        </div>
    );
};

export default Profile;
