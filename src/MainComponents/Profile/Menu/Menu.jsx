import React, { useContext, useEffect, useState } from 'react';
import './Menu.css';
import { useNavigate } from "react-router-dom";
import { Theme } from "../../../HelperModuls/ThemeContext";
import CreateNewChat from "../../../NewChat/CreateNewChat";
import {ThemeMenu} from "../../../NewChat/ContextForMenu/ContextForMenu";

const Menu = ({ active }) => {
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

    const redirectTo = (url) => navigate(url);

    const redirectToLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/');
    };

    const getUserInfo = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/userInfo`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const userImg = await response.text();
            setUserImage(userImg);
        } catch (error) {
            console.error('Error fetching user image:', error);
        }
    };

    const getUser = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/infoAboutUser`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const deleteUserAccount = async () => {
        try {
            if (window.confirm('Are you sure you want to delete your account?')) {
                const response = await fetch(`${backendUrl}/api/user`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) window.location.replace(`${backendUrl}/logout`);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account.');
        }
    };

    const handleThemeChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        setColorTheme(!color);
        document.body.style.backgroundColor = color ? "lightgrey" : "black";
        document.body.style.color = color ? "black" : "white";
    };







    useEffect(() => {
        getUserInfo();
        getUser();
    }, []);

    return (
        <div className={active ? !color? "menu active light": "menu active" : !color ? "menu light":"menu"}>

            {! createNewChat ? (
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
                        <li className={color ?"liMenuNotPoint":"liMenuNotPoint light"}  ><a onClick={() => setIsCreateChat(true)}>Создать новый чат</a></li>
                        <li className="exit"><a onClick={deleteUserAccount}>Удалить аккаунт</a></li>
                        <li className={color ?"liMenuNotPoint":"liMenuNotPoint light"}><a onClick={() => redirectTo('/update')}>Обновить данные</a></li>
                        <li className='exit'><a className="exit" onClick={redirectToLogout}>Выйти</a></li>
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
        </div>
    );
};

export default Menu;
