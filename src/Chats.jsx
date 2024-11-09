import React, {useContext, useEffect, useState} from 'react';

import {MyContext} from "./HelperModuls/ContextForAudio";

import './Styles/Chats.css'
import {Theme} from "./HelperModuls/ThemeContext";


const Chats = () => {
    const [chats, setChats] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeChat, setActiveChat] = useState(0)
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('jwtToken');
    const {updated, setUpdateValue, color, idUpdated, setIdUpdatedValue, chatId, setChatIdValue} = useContext(Theme);


    const responseForTracks = async () => {
        setIsLoading(true)
        const response = await fetch(`${backendUrl}/apiChats/getChats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Добавляем токен в заголовок
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        setChats(data);
        setIsLoading(false)

    }
    // Деструктурируем setDat

    const handleClick = (id) => {
        setChatIdValue(id);
        setActiveChat(id)
        // Правильно вызываем setDat
    };
    useEffect(() => {
        responseForTracks();
    }, []);
    const getLastMessage = async (id) => {

        const response = await fetch(`${backendUrl}/apiChats/getLastMessage/${chatId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Добавляем токен в заголовок
                'Content-Type': 'application/json',
            },
        })
        const ji = response.text()
        console.log(ji)

        return ji;


    }
    useEffect(() => {
        if (updated) {
            const updateLastMessage = async () => {

                    const newLastMessage = await getLastMessage(idUpdated);
                    console.log("log"+ newLastMessage)
                    setChats(prevChats =>
                        prevChats.map(chat =>
                            chat.id === idUpdated
                                ? {...chat, lastMessage: newLastMessage}
                                : chat
                        )
                    );


                    setUpdateValue(false);
                   setIdUpdatedValue(0)// Сбрасываем updated после обновления lastMessage
                }
            updateLastMessage();

        }

    }, [updated, idUpdated, setUpdateValue]);


    return (
        <div>
            <div className={color ? "menu-items" : "menu-items light"}>
                <ul>
                    {isLoading ? (
                        Array.from({length: 5}).map((_, index) => (
                            <li key={index} className="skeleton-track-item">
                                <div className="skeleton-image1"></div>
                                <div className="skeleton-text1"></div>
                            </li>
                        ))
                    ) : chats && chats.length > 0 ? (
                        chats.slice().reverse().map((chat, index) => (
                            <li key={index} className={activeChat === chat.id ? "item active" : "item"}>
                                <img className="track-image-newChat" onClick={() => handleClick(chat.id)}
                                     src={`${backendUrl}/apiChats/chatImages/${chat.id}`} alt="Track"/>
                                <div className="playlist-container">
                                    <div className={color ? "name-playlist" : "name-playlist light"}
                                         onClick={() => handleClick(chat.id)}>{chat.name}</div>
                                    <div
                                        className={color ? "author-playlist" : "author-playlist light"}>{chat.lastMessage !== null && chat.lastMessage.length > 20 ? chat.lastMessage.substring(0, 20) + '...' : chat.lastMessage}</div>
                                </div>

                            </li>
                        ))
                    ) : (
                        <li>Треки не найдены</li>
                    )}
                </ul>
            </div>
        </div>

    );
};
export default Chats;
