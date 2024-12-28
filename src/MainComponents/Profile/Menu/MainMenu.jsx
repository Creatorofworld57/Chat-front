import React, { useContext, useEffect, useState } from 'react';
import './Menu.css';
import { useNavigate } from "react-router-dom";
import { Theme } from "../../../HelperModuls/ThemeContext";
import CreateNewChat from "../../../NewChat/CreateNewChat";
import {ThemeMenu} from "../../../NewChat/ContextForMenu/ContextForMenu";
import $api from "../../../http/middleware";
import settings from "./Settings";

const MainMenu = ({ active }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const {createNewChat ,setIsCreateChat} =useContext(ThemeMenu)


    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('jwtToken');
    const { color, setColorTheme } = useContext(Theme);
    const navigate = useNavigate();
    const toggleToolbar = () => {
        setIsOpen(!isOpen);
        setIsRotated(!isRotated);
    };


    const getUserInfo = async () => {
        try {
            const response = await $api.get(`/api/userInfo`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const userImg = await response.data;
            setUserImage(userImg);
        } catch (error) {
            console.error('Error fetching user image:', error);
        }
    };

    const getUser = async () => {
        try {
            const response = await $api.get(`/api/infoAboutUser`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const userData = await response.data;
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };


    const handleThemeChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        setColorTheme(!color);
    };

    useEffect(() => {
        getUserInfo();
        getUser();
    }, []);

    return (
        <div className={active ? !color? "menu active light": "menu active" : !color ? "menu light":"menu"}>

            {createNewChat===0 ? (
                <div className="menu-content">
                    <ul>
                        {user && (
                            <>
                                <li>
                                    <img id="myImage" src={`${backendUrl}/api/images/${userImage}`} alt="Profile" />
                                </li>
                                <li className={color ?"liMenu":"liMenu light"}>Имя: {user.name}</li>
                                <li className={color ?"liMenu":"liMenu light"}>Created: {new Date(user.createdAt).toLocaleDateString()}</li>
                                <li className={color ?"liMenu":"liMenu light"}>Updated: {new Date(user.updatedAt).toLocaleDateString()}</li>
                            </>
                        )}
                        <li className={color ?"liMenuNotPoint":"liMenuNotPoint light"}  ><a onClick={() => setIsCreateChat(1)}>Создать новый чат</a></li>
                        <li className="exit"><a onClick={()=>setIsCreateChat(2)}>Настройки</a></li>
                        <li className={color ?"liMenuNotPoint":"liMenuNotPoint light"}><a onClick={()=>setIsCreateChat(3)}>Друзья</a></li>

                        <li>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    id="toggle"
                                    className="toggle-input"
                                    checked={isChecked}
                                    onChange={handleThemeChange}
                                />
                                <label htmlFor="toggle" className="toggle-label"></label>
                            </div>
                        </li>
                    </ul>
                </div>
            ) : (
                <CreateNewChat/>
            )}
            <div className="menu-content">




            </div>
        </div>

    );
};

export default MainMenu;
