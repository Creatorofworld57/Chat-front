import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './Update.module.css';
import { jwtDecode } from "jwt-decode";
import {ChatCon} from "../../../HelperModuls/ChatContext";
import $api from "../../../http/middleware";

import {Theme} from "../../../HelperModuls/ThemeContext";



const Messenger = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [name, setName] = useState(1);
    const [isConnected, setIsConnected] = useState(false);
    const [client, setClient] = useState(null);
    const messagesEndRef = useRef(null);
    const [decoded, setDecoded] = useState('')
    const token = localStorage.getItem('jwtToken');
    const [tittle, setTittle] = useState("Чат");
    const [chatOverView, setChatOverView] = useState(true)
    const [files, setFiles] = useState([]);


    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const {setUpdateValue, setIdUpdatedValue, chatId} = useContext(ChatCon);
    const {color} = useContext(Theme);
    const fetchData = async () => {
        try {
            const response = await $api.get(`/api/getid`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const user = await response.data;
            setName(user.id);
            console.log(user.id);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        loadMessages(page);
    }, [page]);
    const loadMessages = async (page) => {
        try {
            const response = await fetch(`/api/messages?page=${page}&limit=20`);
            const data = await response.json();

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setMessages((prev) => [...data.reverse(), ...prev]);
            }
        } catch (error) {
            console.error('Ошибка загрузки сообщений:', error);
        }
    };

    async function sendFile(file) {
        const formData = new FormData();
        formData.append('file', file);  // Добавляем файл в FormData

        try {
            const response = await $api.post(`/api/chat_files`, formData, {
                headers: {
                    'ChatId': chatId.toString(),  // Указываем ChatId в заголовках
                },
            });

            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }



        setFiles([])
    }

   const fetchMessages = async () => {
        try {
            const response = await $api.get(`/apiChats/getMessages/${chatId}`, {
                headers: {
                    // Добавляем токен в заголовок
                    'Content-Type': 'application/json',
                },
            });
            const user = await response.data;
            setMessages(user)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if(chatId) {
            const stompClient = new Client({
                webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('Connected to WebSocket');
                    stompClient.subscribe(`/message/chatGet/${chatId}`, (message) => {
                        console.log(message.body)
                        const parsedMessage = JSON.parse(message.body);
                        setUpdateValue(true)
                        setIdUpdatedValue(parsedMessage.chat.id)
                        console.log(parsedMessage.chat.id)
                        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                    });
                    setIsConnected(true); // Устанавливаем флаг подключения
                },
                onStompError: (frame) => {
                    console.error('STOMP Error:', frame.headers['message']);
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket Error:', error);
                },
            });

            stompClient.activate();
            setClient(stompClient);

            return () => {
                if (stompClient && stompClient.active) {
                    if (stompClient && stompClient.active && typeof stompClient.deactivate === 'function') {

                        console.log('Disconnected from WebSocket');

                        stompClient.deactivate();
                        console.log('Disconnected from WebSocket');
                    }
                }
            };
        }
    }, [chatId]);
    useEffect(() => {
        fetchData();
        fetchMessages();
        decodeToken();
    }, []);

    useEffect(() => {
        if(chatId!==0){
            fetchData();
            fetchMessages();
            decodeToken();
            tittleImgAndData();
        }
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    function decodeToken() {
        try {
            setDecoded(jwtDecode(token))
            console.log(decoded)
            return jwtDecode(token);
        } catch (error) {
            console.error("Ошибка декодирования токена:", error);
            return null;
        }
    }
    const sendMessage = () => {
        console.log("Длина массива " + files.length)
        if (inputMessage&& client.connected && client && files.length === 0) {
            console.log("TEXT")
            setUpdateValue(true)
            setIdUpdatedValue(chatId)

            const payload = {
                data: inputMessage,
                id: chatId,
                token: token
            };
            console.log(JSON.stringify(payload));

            client.publish({
                destination: '/app/chat',
                body: JSON.stringify(payload),
                headers: {
                    'content-type': 'application/json',
                    'Authentication': `Bearer ${token}`,
                    'ChatId': chatId.toString(),
                    'Content-Type': 'text'
                },
            });

            setInputMessage(''); // Очищаем поле ввода после отправки
        }
        else if(client && client.connected && files.length!==0 && files.length<2){
            sendFile(files[0])

        }
        else if(client && client.connected && files.length!==0 && files.length<2  && inputMessage&& client.connected){
            sendFile(files[0])
            setUpdateValue(true)
            setIdUpdatedValue(chatId)

            const payload = {
                data: inputMessage,
                id: chatId,
                token: token
            };
            console.log(JSON.stringify(payload));

            client.publish({
                destination: '/app/chat',
                body: JSON.stringify(payload),
                headers: {
                    'content-type': 'application/json',
                    'Authentication': `Bearer ${token}`,
                    'ChatId': chatId.toString(),
                    'Content-Type': 'text'
                },
            });

            setInputMessage(''); // Очищаем поле ввода после отправки
        }
    };


    const tittleImgAndData = async () => {

        const response = await $api.get(`/apiChats/getChats/${chatId}`)
        const dat = await response.data
        setTittle(dat.name)
    }


    // Обновленный компонент чата с onKeyDown вместо onKeyPress
    return (
        <div className={styles.chatContainer}>
            {chatOverView ? (
                <div>
                    <div className={styles.chatHeader}>{tittle}</div>
                    <div className={!color ? styles.chatWindow : styles.chatWindowLight}>
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`${styles.chatMessage} ${
                                        msg.sender === decoded.id ? styles.user : styles.other
                                    }`}
                                >
                                    <strong>
                                        {msg.sender === decoded.id ? '' : msg.nameUser + ':'}
                                    </strong>
                                    <div className={styles.messageContent}>
                                        {msg.links && msg.links.length > 0 ? (
                                            <div className={styles.imageFrame}>
                                                <img
                                                    src={`https://localhost:8080/api/chat/get_file/${msg.links[0]}`}
                                                    alt="Uploaded file"
                                                    className={styles.chatImage}
                                                />
                                            </div>
                                        ) : (
                                            msg.content || <i>No content</i>
                                        )}
                                    </div>
                                    <div className={styles.messageTimestamp}>
                                        {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div></div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {chatId !== 0 && (
                        <div className={styles.chatInput}>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Введите сообщение..."
                                className={styles.messageInput}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />

                            <label className="file-input-label1" htmlFor="file">
                                <img
                                    src={"https://avatars.mds.yandex.net/i?id=81fe73c0f89760990c5cf80119d4c8a226060f9a-4936013-images-thumbs&n=13"}/>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={(e) =>
                                        setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)])
                                    }
                                    className={styles.input} // Use className instead of style
                                    required
                                />

                            </label>


                            <button onClick={sendMessage} className={styles.sendButton}>
                                Отправить
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );





};

export default Messenger;
