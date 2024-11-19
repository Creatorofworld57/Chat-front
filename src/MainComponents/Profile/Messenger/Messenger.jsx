import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {useContext, useEffect, useRef, useState} from 'react';
import styles from './Update.module.css';
import { jwtDecode } from "jwt-decode";
import {ChatCon} from "../../../HelperModuls/ChatContext";
import $api from "../../../http/middleware";



const Messenger = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [name, setName] = useState(1);
    const [isConnected, setIsConnected] = useState(false);
    const [client, setClient] = useState(null);
    const messagesEndRef = useRef(null);
    const [decoded,setDecoded] = useState('')
    const token = localStorage.getItem('jwtToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const {setUpdateValue,setIdUpdatedValue,chatId} = useContext(ChatCon);
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
        fetchData();
        fetchMessages();
        decodeToken();
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
        if (inputMessage && client) {
           setUpdateValue(true)
            setIdUpdatedValue(chatId)
            const messageContent = {
                content: inputMessage,
                id: chatId,
                token: token
            };
            console.log(JSON.stringify(messageContent));

            client.publish({
                destination: '/app/chat',
                body: JSON.stringify(messageContent),
                headers: {
                    'content-type': 'application/json',
                },
            });

            setInputMessage(''); // Очищаем поле ввода после отправки
        }
    };


    // Обновленный компонент чата с onKeyDown вместо onKeyPress
    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h2>Chat Room</h2>
            </div>
            <div className={styles.chatWindow}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles.chatMessage} ${
                            msg.sender === decoded.id ? styles.user : styles.other
                        }`}
                    >
                        <strong> {msg.sender === decoded.id ?'':msg.nameUser+':'}</strong> {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className={styles.chatInput}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.messageInput}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Предотвращаем перенос строки
                            sendMessage(); // Отправляем сообщение при нажатии Enter
                        }
                    }}
                />
                <button onClick={sendMessage} className={styles.sendButton}>
                    Send
                </button>
            </div>
        </div>
    );

};

export default Messenger;
