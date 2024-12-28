import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Theme } from "../HelperModuls/ThemeContext";
import "./CreateNewChat.css";
import { ThemeMenu } from "./ContextForMenu/ContextForMenu";
import $api, {API_URL} from "../http/middleware";
import {ChatCon} from "../HelperModuls/ChatContext";
import SearchBar from "./search";


const CreateNewChat = ({active}) => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem("jwtToken");
    const { color } = useContext(Theme);
    const { setIsCreateChat } = useContext(ThemeMenu);
    const {setActiveChatValue, chatId, setChatIdValue} = useContext(ChatCon)

    const [filteredData, setFilteredData] = useState([]);
    const data = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape'];
    // Загружаем список пользователей один раз
    const getUsersList = useCallback(async () => {
        try {
            const response = await $api.get(`/api/getUsers`, {
                headers: {

                    "Content-Type": "application/json",
                },
            });
            if (response.status===200) {
                const userList = await response.data;
                setUsers(userList);
            }
        } catch (error) {
            console.error("Error fetching users list:", error);
        }
    }, [backendUrl, token]);

    // Обрабатываем выбор пользователей
    const handleUserSelection = useCallback(
        (id) => {
            setSelectedUsers((prevSelected) =>
                prevSelected.includes(id)
                    ? prevSelected.filter((item) => item !== id)
                    : [...prevSelected, id]
            );
        },
        []
    );

    // Создание чата
    const createChat = useCallback(async () => {

            try {

                const response = await $api.post(
                    `/apiChats/createChat`, // URL
                    selectedUsers, // Передаем массив напрямую
                    {
                        headers: {
                            "Content-Type": "application/json", // Указываем тип данных
                        },
                    }
                );

                if (response.status === 200) {
                    setIsCreateChat(0); // Успешное создание чата
                }
                else{
                    setIsCreateChat(0)
                    setTimeout(
                        setChatIdValue(response.data),
                        setActiveChatValue(response.data),
                        500
                    )
                }
            } catch (error) {
                console.error("Error creating chat:", error);
            }

    }, [selectedUsers, setIsCreateChat]);


    // Загружаем список пользователей при монтировании
    useEffect(() => {
        getUsersList();
    }, [getUsersList]);

    // Мемоизируем отфильтрованный список пользователей
    const renderedUsers = useMemo(
        () =>
            users.slice().reverse().map((user, index) => (
                <li key={index} className="item">
                    <img
                        className={
                            selectedUsers.includes(user.id)
                                ? "track-image-newChat-aprove"
                                : "track-image-newChat"
                        }
                        onClick={() => handleUserSelection(user.id)}
                        src={`${backendUrl}/api/images/${user.id}`}
                        alt="Track"
                        loading="lazy" // Ленивое выполнение загрузки изображений
                    />
                    <div className="newChat-container">
                        <div className={color ? "name-newChat" : "name-playlist light"}>
                            {user.name}
                        </div>
                    </div>
                </li>
            )),
        [users, selectedUsers, handleUserSelection, color, backendUrl]
    );

    return (
        <div  className={active ? !color? "menu active light": "menu active" : !color ? "menu light":"menu"}>
            <ul>
                <SearchBar data={data} onSearch={setFilteredData} />
                <ul>
                    {filteredData.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                {users && users.length > 0 ? renderedUsers : <li>No users available</li>}
                <li className="Create" onClick={createChat}>
                    Создать чат
                </li>
            </ul>
        </div>
    );
};

export default CreateNewChat;
