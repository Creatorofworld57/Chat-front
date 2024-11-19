import React, {useContext, useEffect, useRef, useState} from 'react';
import './Chats.css'
import {Theme} from "../../../HelperModuls/ThemeContext";
import ImageMerger from "./Images/ImageMerger";
import {ThemeMenu} from "../../../NewChat/ContextForMenu/ContextForMenu";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {ChatCon} from "../../../HelperModuls/ChatContext";
import $api from "../../../http/middleware";


const Chats = () => {
    const [chats, setChats] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeChat, setActiveChat] = useState(0)
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('jwtToken');
    const {color} = useContext(Theme);
    const { chatId, setChatIdValue} = useContext(ChatCon)
    const {createNewChat,setIsCreateChat} =useContext(ThemeMenu)
    const [isConnected, setIsConnected] = useState(false);
    const [client, setClient] = useState(null);
    const clientRef = useRef(null);
    const responseForChats = async () => {
        setIsLoading(true)
        const response = await $api.get(`/apiChats/getChats`, {
            method: 'GET',
            headers: {// Добавляем токен в заголовок
                'Content-Type': 'application/json',
            },
        })
        const data = await response.data
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
        if(createNewChat===false)
             responseForChats();
    }, [createNewChat]);
    const getLastMessage = async (id) => {

        const response = await $api.get(`/apiChats/getLastMessage/${chatId}`, {
            headers: {// Добавляем токен в заголовок
                'Content-Type': 'application/json',
            },
        })
        const ji = response.data
        console.log(ji)

        return ji;


    }
   /* useEffect(() => {
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

    }, [updated, idUpdated, setUpdateValue]);*/

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe(`/message/chatUpdated`, (message) => {
                    const parsedMessage = JSON.parse(message.body);
                    console.log("chat", parsedMessage);

                    if (chats.some(chat => chat.id === parsedMessage.id)) {
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === parsedMessage.id
                                    ? { ...chat, lastMessage: parsedMessage.lastMessage }
                                    : chat
                            )
                        );
                    }
                });
                setIsConnected(true);
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
                setIsConnected(false);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
                setIsConnected(false);
            },
        });

        clientRef.current = stompClient;
        stompClient.activate();

        return () => {
            if (clientRef.current?.active) {
                clientRef.current.deactivate();
                console.log('Disconnected from WebSocket');
            }
        };
    }, [backendUrl, chats, setChats]);





    return (
        <div>
            <div className={color ? "menu-items" : "menu-items light"}>

                    {isLoading ? (
                        Array.from({length: 5}).map((_, index) => (
                            <li key={index} className="skeleton-track-item">
                                <div className="skeleton-image1"></div>
                                <div className="skeleton-text1"></div>
                            </li>
                        ))
                    ) : chats && chats.length > 0 ? (
                        chats.slice().reverse().map((chat, index) => (
                            <li  key={index} className={activeChat === chat.id ? "item active" : "item"} onClick={() => handleClick(chat.id)}>
                                <ImageMerger chatIds={chat.participants}/>
                                <div className="playlist-container">
                                    <div className={color ? "name-playlist" : "name-playlist light"}
                                      >{chat.name}</div>
                                    <div
                                        className={color ? "author-playlist" : "author-playlist light"}>{chat.lastMessage !== null && chat.lastMessage.length > 20 ? chat.lastMessage.substring(0, 20) + '...' : chat.lastMessage}</div>
                                </div>

                            </li>
                        ))
                    ) : (
                        <li>Чаты не найдены</li>
                    )}

            </div>
        </div>

    );
};
export default Chats;
